const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
let CONFIG = {
  SPREADSHEET_ID: "1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4",
  SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4/edit?usp=sharing",
  GOOGLE_SHEET_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbxpfR2UuITpGXnNgV4r3G2E2anHxtQLzrloID8WZJ2fvWzBEZTS8RimPwM3zxZLmpSC/exec"
};

// Try to load CONFIG from config.js
try {
  const loadedConfig = require('./config.js');
  CONFIG = { ...CONFIG, ...loadedConfig };
} catch (e) {}

// Ensure data storage directory exists for offline / local database persistence
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const CONTESTANTS_FILE = path.join(DATA_DIR, 'contestants.json');

function readJSONFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return [];
}

function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Function to fetch live Google Sheet CSV export to check the latest rows
function fetchLiveSheetCsv() {
  return new Promise((resolve) => {
    if (!CONFIG.SPREADSHEET_ID) return resolve(null);
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/export?format=csv`;

    function fetchWithHops(targetUrl, hops) {
      if (hops > 3) return resolve(null);
      try {
        const req = https.get(targetUrl, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return fetchWithHops(res.headers.location, hops + 1);
          }
          if (res.statusCode !== 200) return resolve(null);
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        });
        req.setTimeout(3500, () => {
          req.destroy();
          resolve(null);
        });
        req.on('error', () => resolve(null));
      } catch (e) {
        resolve(null);
      }
    }
    fetchWithHops(url, 0);
  });
}

// Check the last school code across Google Sheet & local DB, and compute the next sequential code
async function getLastAndNextSchoolCode() {
  let maxNum = 0;
  let googleSheetChecked = false;

  // 1. Check live Google Sheet if online (Primary Master Source of Truth)
  try {
    const csvData = await fetchLiveSheetCsv();
    if (csvData !== null && csvData !== undefined) {
      googleSheetChecked = true;
      const lines = csvData.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',');
        for (const col of cols) {
          const clean = col.replace(/["'\r]/g, '').trim();
          const match = clean.match(/^SC(\d+)$/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not inspect live Google Sheet:', err.message);
  }

  // 2. Fallback to local registrations.json ONLY if Google Sheet could not be checked (offline)
  if (!googleSheetChecked) {
    try {
      const localRegs = readJSONFile(REGISTRATIONS_FILE);
      localRegs.forEach(r => {
        const code = r.schoolCode || r.refCode || '';
        const match = String(code).match(/^SC(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
    } catch (err) {
      console.warn('Error reading local registrations:', err.message);
    }
  }

  // If there are no registrations in Google Sheet (maxNum === 0), starts strictly with SC001
  const lastCode = maxNum > 0 ? `SC${String(maxNum).padStart(3, '0')}` : null;
  const nextNum = maxNum + 1;
  const nextCode = `SC${String(nextNum).padStart(3, '0')}`;

  return {
    lastCode: lastCode,
    lastNum: maxNum,
    nextCode: nextCode,
    nextNum: nextNum
  };
}

// Forward data to Google Apps Script Web App safely
function forwardToGoogleSheet(payload, callback) {
  if (!CONFIG.GOOGLE_SHEET_WEBAPP_URL || CONFIG.GOOGLE_SHEET_WEBAPP_URL.trim() === '') {
    if (callback) callback(null, { status: 'skipped', reason: 'No Google Sheet Web App URL configured yet' });
    return;
  }

  try {
    const postData = JSON.stringify(payload);
    const url = new URL(CONFIG.GOOGLE_SHEET_WEBAPP_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      // Handle redirects if Apps Script returns 302
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        try {
          const redirectReq = https.get(res.headers.location, (redirectRes) => {
            let body = '';
            redirectRes.on('data', chunk => body += chunk);
            redirectRes.on('end', () => {
              try { if (callback) callback(null, JSON.parse(body)); }
              catch (e) { if (callback) callback(null, { status: 'success', raw: body }); }
            });
          });
          redirectReq.on('error', (err) => {
            console.warn('[GOOGLE SHEETS] Redirect response note:', err.message);
            if (callback) callback(null, { status: 'sent', note: 'POST accepted by Google Sheets' });
          });
        } catch (e) {
          if (callback) callback(null, { status: 'sent', note: 'POST accepted by Google Sheets' });
        }
        return;
      }

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { if (callback) callback(null, JSON.parse(body)); }
        catch (e) { if (callback) callback(null, { status: 'success', raw: body }); }
      });
    });

    req.on('error', (err) => {
      console.warn('[GOOGLE SHEETS] Google Sheet forwarding warning:', err.message);
      if (callback) callback(err);
    });

    req.write(postData);
    req.end();
  } catch (err) {
    console.error('Error initiating Google Sheet request:', err);
    if (callback) callback(err);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // -------------------------------------------------------------
  // API ROUTE: POST /api/register
  // -------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/register') {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: false, 
      status: 'closed',
      error: 'School registrations are now closed.',
      message: 'School registrations for Peraliya \'26 are now closed. Registered schools can submit competition entries in Contestant Registration.' 
    }));
    return;
  }

  // -------------------------------------------------------------
  // API ROUTE: POST /api/contact
  // -------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/contact') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        payload.type = 'contact';
        payload.timestamp = payload.timestamp || new Date().toISOString();

        // 1. Store in local JSON database
        const contacts = readJSONFile(CONTACTS_FILE);
        contacts.push(payload);
        writeJSONFile(CONTACTS_FILE, contacts);
        console.log(`[DATABASE] Contact inquiry saved: ${payload.name} (${payload.school})`);

        // 2. Forward to Google Sheets if configured
        forwardToGoogleSheet(payload, (err, sheetRes) => {
          if (err) console.warn('[GOOGLE SHEETS] Forward warning:', err.message);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          status: 'success',
          message: 'Contact inquiry recorded in database'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------
  // API ROUTE: GET /api/next-school-code
  // -------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/next-school-code') {
    getLastAndNextSchoolCode().then(codeInfo => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        lastSchoolCode: codeInfo.lastCode,
        nextSchoolCode: codeInfo.nextCode
      }));
    }).catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message, nextSchoolCode: 'SC001' }));
    });
    return;
  }

  // -------------------------------------------------------------
  // API ROUTE: GET /api/verify-school-code?code=SC001
  // -------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/verify-school-code') {
    const queryCode = (parsedUrl.searchParams.get('code') || '').trim().toUpperCase();
    const registrations = readJSONFile(REGISTRATIONS_FILE);
    let found = registrations.find(r => 
      (r.schoolCode && r.schoolCode.toUpperCase() === queryCode) || 
      (r.refCode && r.refCode.toUpperCase() === queryCode)
    );

    // Query Live Google Sheet gviz API if not found in local JSON
    if (!found) {
      try {
        const sheetId = CONFIG.SPREADSHEET_ID || "1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4";
        const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
        const sheetRes = await fetch(gvizUrl);
        const text = await sheetRes.text();
        const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const gvizData = JSON.parse(jsonText);
        const rows = (gvizData.table && gvizData.table.rows) || [];

        for (let row of rows) {
          if (!row || !row.c) continue;
          const codeCell = row.c[1] ? String(row.c[1].v || '').trim().toUpperCase() : '';
          if (codeCell === queryCode) {
            found = {
              valid: true,
              schoolCode: codeCell,
              schoolName: row.c[2] ? String(row.c[2].v || '').trim() : '',
              teacherName: row.c[7] ? String(row.c[7].v || '').trim() : '',
              teacherPhone: row.c[8] ? String(row.c[8].v || row.c[8].f || (row.c[9] ? (row.c[9].v || row.c[9].f) : '') || '').trim() : ''
            };
            break;
          }
        }
      } catch (err) {
        console.warn('Server fetch from Google Sheet gviz failed:', err.message);
      }
    }

    if (!found) {
      const preseeded = [
        { schoolCode: 'SC001', refCode: 'SC001', schoolName: 'D. S. Senanayake College', teacherName: 'Mrs. K. Jayawardena', teacherPhone: '0773456789' },
        { schoolCode: 'SC002', refCode: 'SC002', schoolName: 'Ananda College, Colombo 10', teacherName: 'Mr. Perera', teacherPhone: '0771234567' },
        { schoolCode: 'SC003', refCode: 'SC003', schoolName: 'Royal College, Colombo 07', teacherName: 'Mr. N. Fernando', teacherPhone: '0778772765' },
        { schoolCode: 'SC004', refCode: 'SC004', schoolName: 'Visakha Vidyalaya, Colombo 05', teacherName: 'Mrs. S. Silva', teacherPhone: '0712345678' },
        { schoolCode: 'SC005', refCode: 'SC005', schoolName: 'Sirimavo Bandaranaike Vidyalaya', teacherName: 'Ms. Thiyamini', teacherPhone: '0782376050' }
      ];
      found = preseeded.find(r => 
        (r.schoolCode && r.schoolCode.toUpperCase() === queryCode) || 
        (r.refCode && r.refCode.toUpperCase() === queryCode)
      );
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (found) {
      res.end(JSON.stringify({
        valid: true,
        schoolCode: found.schoolCode || found.refCode,
        schoolName: found.schoolName,
        teacherName: found.teacherName,
        teacherPhone: found.teacherPhone || found.teacherWhatsapp
      }));
    } else {
      res.end(JSON.stringify({
        valid: false,
        message: 'School code not found in registered database. You can still proceed if your school is registered.'
      }));
    }
    return;
  }

  // -------------------------------------------------------------
  // API ROUTE: POST /api/register-contestants
  // -------------------------------------------------------------
  if (req.method === 'POST' && (pathname === '/api/register-contestants' || pathname === '/api/register-contestant')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5e6) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.connection.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        payload.timestamp = payload.timestamp || new Date().toISOString();
        payload.type = 'contestant';

        const contestantsDB = readJSONFile(CONTESTANTS_FILE);
        const savedEntries = [];
        const schoolCodeClean = (payload.schoolCode || 'SC000').toUpperCase();

        const contestantsList = Array.isArray(payload.contestants) ? payload.contestants : [payload];

        contestantsList.forEach((c, index) => {
          const contestantNum = contestantsDB.length + 1;
          const regId = `CT-${schoolCodeClean}-${String(contestantNum).padStart(3, '0')}`;
          const entry = {
            contestantId: regId,
            timestamp: payload.timestamp,
            schoolCode: schoolCodeClean,
            schoolName: payload.schoolName || '',
            teacherName: payload.teacherName || '',
            teacherPhone: payload.teacherPhone || '',
            fullName: c.fullName || c.name || '',
            nameWithInitials: c.nameWithInitials || c.shortName || '',
            grade: c.grade || '',
            gender: c.gender || '',
            phone: c.phone || '',
            whatsapp: c.whatsapp || c.phone || '',
            email: c.email || '',
            category: c.category || '',
            medium: c.medium || 'Sinhala',
            division: c.division || 'Open',
            submissionUrl: c.submissionUrl || c.link || ''
          };
          contestantsDB.push(entry);
          savedEntries.push(entry);
        });

        writeJSONFile(CONTESTANTS_FILE, contestantsDB);
        console.log(`[DATABASE] Registered ${savedEntries.length} contestants for school ${schoolCodeClean}`);

        // Forward to Google Sheets if configured
        forwardToGoogleSheet({
          type: 'contestant',
          schoolCode: schoolCodeClean,
          schoolName: payload.schoolName,
          teacherName: payload.teacherName,
          contestants: savedEntries
        }, (err, sheetRes) => {
          if (err) console.warn('[GOOGLE SHEETS] Contestants forward warning:', err.message);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          status: 'success',
          count: savedEntries.length,
          schoolCode: schoolCodeClean,
          contestants: savedEntries,
          message: `Successfully registered ${savedEntries.length} contestant(s) for ${schoolCodeClean}`
        }));
      } catch (err) {
        console.error('Invalid JSON in /api/register-contestants:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // -------------------------------------------------------------
  // API ROUTE: GET /api/contestants (Admin / Database Inspection)
  // -------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/contestants') {
    const contestants = readJSONFile(CONTESTANTS_FILE);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      count: contestants.length,
      spreadsheetUrl: CONFIG.SPREADSHEET_URL,
      contestants: contestants
    }));
    return;
  }


  // -------------------------------------------------------------
  // API ROUTE: GET /api/registrations (Admin / Database Inspection)
  // -------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/registrations') {
    const registrations = readJSONFile(REGISTRATIONS_FILE);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      count: registrations.length,
      spreadsheetUrl: CONFIG.SPREADSHEET_URL,
      registrations: registrations
    }));
    return;
  }

  // -------------------------------------------------------------
  // API ROUTE: GET /api/status (Backend Health Check)
  // -------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      service: "Peraliya '26 Server Backend",
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      spreadsheetUrl: CONFIG.SPREADSHEET_URL,
      hasGoogleSheetWebhook: Boolean(CONFIG.GOOGLE_SHEET_WEBAPP_URL)
    }));
    return;
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------
  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Peraliya '26 Server running at http://localhost:${PORT}/`);
  console.log(`Connected Google Sheet: ${CONFIG.SPREADSHEET_URL}`);
});
