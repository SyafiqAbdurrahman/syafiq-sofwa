function doPost(e) {
  try {
    // Log untuk debugging
    console.log('Received POST request');
    console.log('Content Type:', e.contentLength);
    console.log('Post Data:', e.postData);
    
    // ID Spreadsheet Anda
    const SPREADSHEET_ID = '1c74iEkjCkOkqcJxddyuCMbTLBiVICl1mzs2UgBDfOCI';
    const SHEET_NAME = 'RSVP Data';
    
    // Buka spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Jika sheet belum ada, buat sheet baru dengan header
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Nama', 'Kehadiran', 'Ucapan']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    // Parse data dari request - handle different formats
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        console.log('JSON parse error:', parseError);
        // Try URL encoded format
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    console.log('Parsed data:', data);
    
    // Validasi data
    if (!data.name || !data.attendance || !data.wish) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Data tidak lengkap - name: ' + data.name + ', attendance: ' + data.attendance + ', wish: ' + data.wish
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    // Tambahkan data ke sheet
    const timestamp = new Date();
    const newRow = [
      timestamp,
      data.name,
      data.attendance,
      data.wish
    ];
    
    sheet.appendRow(newRow);
    
    // Format timestamp column
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    
    console.log('Data saved successfully');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data berhasil disimpan',
        timestamp: timestamp.toLocaleString('id-ID')
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Terjadi kesalahan: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

function doGet(e) {
  try {
    const SPREADSHEET_ID = '1c74iEkjCkOkqcJxddyuCMbTLBiVICl1mzs2UgBDfOCI';
    const SHEET_NAME = 'RSVP Data';
    
    // Check if this is a form submission via GET parameters
    if (e.parameter.name && e.parameter.attendance && e.parameter.wish) {
      console.log('Processing form submission via GET');
      return handleFormSubmission(e.parameter, SPREADSHEET_ID, SHEET_NAME);
    }
    
    // Otherwise, return wishes data
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // Create sheet if it doesn't exist
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Nama', 'Kehadiran', 'Ucapan']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.setFrozenRows(1);
      
      const response = {
        success: true,
        wishes: [],
        count: 0
      };
      
      return createResponse(response, e.parameter.callback);
    }
    
    // Ambil semua data kecuali header
    const data = sheet.getDataRange().getValues();
    const wishes = [];
    
    // Skip header row (index 0) and check if there's data
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][1]) { // Check if name exists
          wishes.push({
            timestamp: data[i][0],
            name: data[i][1],
            attendance: data[i][2],
            wish: data[i][3]
          });
        }
      }
    }
    
    // Urutkan berdasarkan timestamp terbaru
    wishes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const response = {
      success: true,
      wishes: wishes,
      count: wishes.length
    };
    
    return createResponse(response, e.parameter.callback);
      
  } catch (error) {
    console.error('Error:', error);
    const response = {
      success: false,
      message: 'Terjadi kesalahan: ' + error.toString()
    };
    
    return createResponse(response, e.parameter.callback);
  }
}

function handleFormSubmission(data, spreadsheetId, sheetName) {
  try {
    console.log('Handling form submission:', data);
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Nama', 'Kehadiran', 'Ucapan']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    // Add data to sheet
    const timestamp = new Date();
    const newRow = [
      timestamp,
      data.name,
      data.attendance,
      data.wish
    ];
    
    sheet.appendRow(newRow);
    
    // Format timestamp column
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    
    console.log('Data saved successfully');
    
    const response = {
      success: true,
      message: 'Data berhasil disimpan',
      timestamp: timestamp.toLocaleString('id-ID')
    };
    
    return createResponse(response, data.callback);
    
  } catch (error) {
    console.error('Error in form submission:', error);
    const response = {
      success: false,
      message: 'Terjadi kesalahan: ' + error.toString()
    };
    
    return createResponse(response, data.callback);
  }
}

function createResponse(data, callback) {
  const jsonResponse = JSON.stringify(data);
  
  if (callback) {
    // JSONP response
    return ContentService
      .createTextOutput(callback + '(' + jsonResponse + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Regular JSON response
    return ContentService
      .createTextOutput(jsonResponse)
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}
