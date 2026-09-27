/**
 * ==========================================================================
 * PERALIYA '26 - SISUVISARA MEDIA UNIT
 * Sirimavo Bandaranaike Vidyalaya, Colombo 07
 * Google Sheets Database Backend Script (Google Apps Script)
 * ==========================================================================
 * Spreadsheet ID: 1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4
 * Spreadsheet URL: https://docs.google.com/spreadsheets/d/1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4/edit
 * Web App URL: https://script.google.com/macros/s/AKfycbxpfR2UuITpGXnNgV4r3G2E2anHxtQLzrloID8WZJ2fvWzBEZTS8RimPwM3zxZLmpSC/exec
 * Library Version 2: https://script.google.com/macros/library/d/1-bOb8BvDGG9hhAB9eI_tpEDZnOK46BH6x0N9ZB9MbmSkgRTutVzwQqes/2
 *
 * HOW TO UPDATE / DEPLOY IN GOOGLE SHEETS:
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/1fHLmBIICtzFRmSsMANHo2c6yxS1T7yDW-WPl58szVq4/edit
 * 2. In the top menu, click: "Extensions" > "Apps Script"
 * 3. Delete existing code and paste this entire file content.
 * 4. Click the blue "Deploy" button at top right > "Manage deployments"
 * 5. Click the pencil/edit icon on your active deployment, select "New version", and click "Deploy".
 *    (Or click "New deployment" > Select type: Web app > Who has access: Anyone > Deploy).
 * ==========================================================================
 */

// Helper to inspect the sheet, find the last SC code, and compute the next sequential code
function getLastSchoolCodeInfo(sheet) {
  var lastRow = sheet.getLastRow();
  var maxNum = 0;

  if (lastRow > 1) {
    // Read Column 2 (School Code column)
    var codeRange = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
    // Scan all rows to identify the highest SC code
    for (var i = codeRange.length - 1; i >= 0; i--) {
      var val = String(codeRange[i][0] || '').trim();
      var match = val.match(/^SC(\d+)$/i);
      if (match) {
        var num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  // Last code strictly reflects the highest SC code found
  var lastCode = maxNum > 0 ? "SC" + ("000" + maxNum).slice(-Math.max(3, String(maxNum).length)) : null;
  // Next number is strictly the number after the last/highest SC code found
  var nextNum = maxNum + 1;
  var paddedNext = ("000" + nextNum).slice(-Math.max(3, String(nextNum).length));
  var nextCode = "SC" + paddedNext;

  return {
    lastCode: lastCode,
    lastNum: maxNum,
    nextCode: nextCode,
    nextNum: nextNum
  };
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Wait up to 10 seconds for concurrent requests
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var postData;
    
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        postData = e.parameter;
      }
    } else {
      postData = e.parameter || {};
    }

    var recordType = postData.type || "registration";

    if (recordType === "contact") {
      // -------------------------------------------------------------
      // CONTACT INQUIRIES SHEET
      // -------------------------------------------------------------
      var contactSheet = ss.getSheetByName("Contact Inquiries");
      if (!contactSheet) {
        contactSheet = ss.insertSheet("Contact Inquiries");
        var headers = [
          "Timestamp",
          "Contact Name",
          "School Name",
          "Phone Number",
          "Subject / Category",
          "Message Details"
        ];
        contactSheet.appendRow(headers);
        var headerRange = contactSheet.getRange(1, 1, 1, headers.length);
        headerRange.setBackground("#0051ba");
        headerRange.setFontColor("#ffffff");
        headerRange.setFontWeight("bold");
        contactSheet.setFrozenRows(1);
      }

      contactSheet.appendRow([
        new Date().toLocaleString("en-GB", { timeZone: "Asia/Colombo" }),
        postData.name || "",
        postData.school || "",
        postData.phone || "",
        postData.subject || "",
        postData.message || ""
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Contact inquiry recorded successfully"
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      // -------------------------------------------------------------
      // REGISTRATIONS SHEET (Official School Registrations)
      // -------------------------------------------------------------
      var regSheet = ss.getSheetByName("Registrations");
      if (!regSheet) {
        var firstSheet = ss.getActiveSheet();
        if (firstSheet.getName() === "Sheet1" && firstSheet.getLastRow() <= 1) {
          regSheet = firstSheet;
          regSheet.setName("Registrations");
        } else {
          regSheet = ss.insertSheet("Registrations");
        }
      }

      var regHeaders = [
        "Timestamp",
        "School Code",
        "School Name",
        "Province",
        "District",
        "School Office Telephone",
        "Official School Email",
        "School Coordinator",
        "Coordinator Mobile",
        "Coordinator WhatsApp",
        "Coordinator Email",
        "Student President / Representative",
        "Registration Status"
      ];

      // Format header row if empty or verify columns
      if (regSheet.getLastRow() === 0) {
        regSheet.appendRow(regHeaders);
        var regHeaderRange = regSheet.getRange(1, 1, 1, regHeaders.length);
        regHeaderRange.setBackground("#003366");
        regHeaderRange.setFontColor("#00e5ff");
        regHeaderRange.setFontWeight("bold");
        regSheet.setFrozenRows(1);
      } else {
        // Auto-fix Column 2 header if labeled "Reference Code"
        var col2Val = String(regSheet.getRange(1, 2).getValue()).trim();
        if (col2Val === "Reference Code" || col2Val === "") {
          regSheet.getRange(1, 2).setValue("School Code");
        }
        // Auto-fix Column 8 header if labeled "Teacher in charge"
        var col8Val = String(regSheet.getRange(1, 8).getValue()).trim();
        if (/teacher/i.test(col8Val)) {
          regSheet.getRange(1, 8).setValue("School Coordinator");
        }
      }

      // -------------------------------------------------------------
      // CHECK LAST SCHOOL CODE & CREATE NEXT CODE: SC001, SC002, SC003...
      // -------------------------------------------------------------
      var codeInfo = getLastSchoolCodeInfo(regSheet);
      var issuedSchoolCode = codeInfo.nextCode;

      // If client / server passed an SC code, verify it
      var incomingCode = (postData.schoolCode || postData.refCode || "").toString().trim().toUpperCase();
      var incomingMatch = incomingCode.match(/^SC(\d+)$/i);
      if (incomingMatch) {
        var incNum = parseInt(incomingMatch[1], 10);
        // If incoming code matches or advances sequence, we honor it
        if (incNum >= codeInfo.nextNum) {
          issuedSchoolCode = incomingCode;
        }
      }

      regSheet.appendRow([
        new Date().toLocaleString("en-GB", { timeZone: "Asia/Colombo" }),
        issuedSchoolCode,
        postData.schoolName || "",
        postData.province || "",
        postData.district || "",
        postData.schoolPhone || "",
        postData.schoolEmail || "",
        postData.teacherName || "",
        postData.teacherPhone || "",
        postData.teacherWhatsapp || "",
        postData.teacherEmail || "",
        postData.presidentName || "",
        "Confirmed"
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        schoolCode: issuedSchoolCode,
        refCode: issuedSchoolCode,
        lastSchoolCode: codeInfo.lastCode,
        nextSchoolCode: issuedSchoolCode,
        message: "School registration recorded in database. School Code: " + issuedSchoolCode
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regSheet = ss.getSheetByName("Registrations") || ss.getActiveSheet();
  var codeInfo = getLastSchoolCodeInfo(regSheet);

  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Peraliya '26 Google Sheets Database Endpoint",
    spreadsheet: ss.getUrl(),
    lastSchoolCode: codeInfo.lastCode || "None (Will start at SC001)",
    nextSchoolCode: codeInfo.nextCode
  })).setMimeType(ContentService.MimeType.JSON);
}
