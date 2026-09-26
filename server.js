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
  let lastCodeFound = null;

  // 1. Check live Google Sheet if online
  try {
    const csvData = await fetchLiveSheetCsv();
    if (csvData) {
      const lines = csvData.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const cols = lines[i].split(',');
        for (const col of cols) {
          const clean = col.replace(/["'\r]/g, '').trim();
          const match = clean.match(/^SC(\d+)$/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num)) {
              if (num > maxNum) maxNum = num;
              if (!lastCodeFound) {
                lastCodeFound = `SC${String(num).padStart(3, '0')}`;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not inspect live Google Sheet:', err.message);
  }

  // 2. Also check local registrations.json
  try {
    const localRegs = readJSONFile(REGISTRATIONS_FILE);
    localRegs.forEach(r => {
      const code = r.schoolCode || r.refCode || '';
      const match = String(code).match(/^SC(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
          if (!lastCodeFound) {
            lastCodeFound = `SC${String(num).padStart(3, '0')}`;
          }
        }
      }
    });
  } catch (err) {
    console.warn('Error reading local registrations:', err.message);
  }

  const nextNum = maxNum + 1;
  const nextCode = `SC${String(nextNum).padStart(3, '0')}`;

  return {
    lastCode: lastCodeFound,
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

const server = http.createServer((req, res) => {
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
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5e6) { // 5MB limit
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.connection.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        payload.timestamp = payload.timestamp || new Date().toISOString();
        
        // Dynamically check the last school code and create the school code after that
        const codeInfo = await getLastAndNextSchoolCode();
        payload.schoolCode = codeInfo.nextCode;
        payload.refCode = codeInfo.nextCode;

        // 1. Store in local JSON database
        const registrations = readJSONFile(REGISTRATIONS_FILE);
        registrations.push(payload);
        writeJSONFile(REGISTRATIONS_FILE, registrations);
        console.log(`[DATABASE] School registered: ${payload.schoolCode} (After: ${codeInfo.lastCode || 'None'}) - ${payload.schoolName}`);

        // 2. Forward to Google Sheets if configured
        forwardToGoogleSheet(payload, (err, sheetRes) => {
          if (err) {
            console.warn(`[GOOGLE SHEETS] Could not forward to Google Sheet:`, err.message);
          } else {
            console.log(`[GOOGLE SHEETS] Sync status:`, sheetRes);
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          status: 'success',
          schoolCode: payload.schoolCode,
          refCode: payload.schoolCode,
          lastSchoolCode: codeInfo.lastCode,
          nextSchoolCode: payload.schoolCode,
          message: 'School registration recorded successfully in database',
          spreadsheetUrl: CONFIG.SPREADSHEET_URL
        }));
      } catch (err) {
        console.error('Invalid JSON in /api/register:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
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
