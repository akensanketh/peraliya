/**
 * ==========================================================================
 * PERALIYA '26 - CONFIGURATION & DATABASE SETTINGS
 * ==========================================================================
 */
const CONFIG = {
  // Google Spreadsheet ID & Public URL
  SPREADSHEET_ID: "1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4",
  SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4/edit?usp=sharing",

  // Google Apps Script Web App Endpoint URL:
  GOOGLE_SHEET_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbxpfR2UuITpGXnNgV4r3G2E2anHxtQLzrloID8WZJ2fvWzBEZTS8RimPwM3zxZLmpSC/exec",

  // Local Backend API Endpoint (used when running via node server.js)
  API_BASE_URL: "/api"
};

// Export for Node.js if in commonjs environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
