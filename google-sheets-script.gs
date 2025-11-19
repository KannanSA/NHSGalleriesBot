/**
 * Mental Health Chatbot - Google Sheets Script
 * 
 * This script provides automatic formatting, data validation, and helper functions
 * for the Mental Health Chatbot data logging sheet.
 * 
 * To install:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Click Save (disk icon)
 * 6. Run the 'onOpen' function once to authorize
 * 7. Refresh your sheet - you'll see a new "Chatbot Tools" menu
 */

/**
 * Runs when the spreadsheet is opened
 * Adds custom menu to the UI
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Chatbot Tools')
    .addItem('Setup Headers', 'setupHeaders')
    .addItem('Format Sheet', 'formatSheet')
    .addItem('Generate Summary Report', 'generateSummaryReport')
    .addItem('Export High-Risk Cases', 'exportHighRiskCases')
    .addItem('Calculate Statistics', 'calculateStatistics')
    .addSeparator()
    .addItem('Protect Data', 'protectDataRange')
    .addToUi();
}

/**
 * Sets up the header row with proper formatting
 */
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Please rename your sheet to "Sheet1" or modify this script.');
    return;
  }
  
  // Define headers
  const headers = [
    'Timestamp',
    'Session ID',
    'Age 18+',
    'Risk Q1 (Suicidal/Self-harm)',
    'Risk Q2 (Physical)',
    'Risk Q3 (Psychosis)',
    'Main Story',
    'Ideas',
    'Concerns',
    'Expectations',
    'Duration',
    'Triggers',
    'Impact',
    'Support',
    'Substances',
    'PHQ-9 Score',
    'PHQ-9 Impact',
    'GAD-7 Score',
    'GAD-7 Impact',
    'Avatar Chat History'
  ];
  
  // Set headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Format headers
  headerRange
    .setBackground('#4f46e5')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  SpreadsheetApp.getUi().alert('Headers setup complete!');
}

/**
 * Formats the entire sheet with conditional formatting and styling
 */
function formatSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Sheet1 not found!');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No data to format!');
    return;
  }
  
  // Alternate row colors for better readability
  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
  
  // Clear existing formatting
  dataRange.setBackground(null);
  
  // Apply alternating colors
  for (let i = 2; i <= lastRow; i++) {
    const rowRange = sheet.getRange(i, 1, 1, lastCol);
    if (i % 2 === 0) {
      rowRange.setBackground('#f9fafb');
    } else {
      rowRange.setBackground('#ffffff');
    }
  }
  
  // Format timestamp column
  sheet.getRange(2, 1, lastRow - 1, 1)
    .setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  // Highlight high-risk cases (Risk Q1, Q2, or Q3 = Yes)
  highlightHighRiskCases(sheet, lastRow);
  
  // Highlight high PHQ-9 scores (≥15)
  highlightHighScores(sheet, lastRow, 16, 15, '#fef3c7'); // PHQ-9 column
  
  // Highlight high GAD-7 scores (≥15)
  highlightHighScores(sheet, lastRow, 18, 15, '#fef3c7'); // GAD-7 column
  
  // Set text wrapping for text columns
  const textColumns = [7, 8, 9, 10, 12, 20]; // Main Story, Ideas, Concerns, Expectations, Triggers, Avatar Chat
  textColumns.forEach(col => {
    sheet.getRange(2, col, lastRow - 1, 1).setWrap(true);
  });
  
  SpreadsheetApp.getUi().alert('Sheet formatting complete!');
}

/**
 * Highlights rows where any risk question was answered "Yes"
 */
function highlightHighRiskCases(sheet, lastRow) {
  for (let i = 2; i <= lastRow; i++) {
    const riskQ1 = sheet.getRange(i, 4).getValue(); // Risk Q1
    const riskQ2 = sheet.getRange(i, 5).getValue(); // Risk Q2
    const riskQ3 = sheet.getRange(i, 6).getValue(); // Risk Q3
    
    if (riskQ1 === 'Yes' || riskQ2 === 'Yes' || riskQ3 === 'Yes') {
      sheet.getRange(i, 1, 1, sheet.getLastColumn())
        .setBackground('#fee2e2'); // Light red
    }
  }
}

/**
 * Highlights cells in a column that exceed a threshold
 */
function highlightHighScores(sheet, lastRow, col, threshold, color) {
  for (let i = 2; i <= lastRow; i++) {
    const value = sheet.getRange(i, col).getValue();
    if (typeof value === 'number' && value >= threshold) {
      sheet.getRange(i, col).setBackground(color);
    }
  }
}

/**
 * Generates a summary report in a new sheet
 */
function generateSummaryReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('Sheet1');
  
  if (!dataSheet) {
    SpreadsheetApp.getUi().alert('Sheet1 not found!');
    return;
  }
  
  const lastRow = dataSheet.getLastRow();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No data to analyze!');
    return;
  }
  
  // Create or clear summary sheet
  let summarySheet = ss.getSheetByName('Summary');
  if (summarySheet) {
    summarySheet.clear();
  } else {
    summarySheet = ss.insertSheet('Summary');
  }
  
  // Calculate statistics
  const stats = calculateStats(dataSheet, lastRow);
  
  // Write summary
  const summaryData = [
    ['Mental Health Chatbot - Summary Report'],
    ['Generated:', new Date()],
    [''],
    ['Total Sessions:', stats.totalSessions],
    [''],
    ['Risk Assessment'],
    ['High Risk Cases (any risk flag):', stats.highRiskCount],
    ['Suicidal/Self-harm thoughts:', stats.riskQ1Count],
    ['Physical health concerns:', stats.riskQ2Count],
    ['Psychosis indicators:', stats.riskQ3Count],
    [''],
    ['PHQ-9 Depression Scores'],
    ['Average Score:', stats.phq9Avg.toFixed(2)],
    ['Minimal (0-4):', stats.phq9Minimal],
    ['Mild (5-9):', stats.phq9Mild],
    ['Moderate (10-14):', stats.phq9Moderate],
    ['Moderately Severe (15-19):', stats.phq9ModSevere],
    ['Severe (20-27):', stats.phq9Severe],
    [''],
    ['GAD-7 Anxiety Scores'],
    ['Average Score:', stats.gad7Avg.toFixed(2)],
    ['Minimal (0-4):', stats.gad7Minimal],
    ['Mild (5-9):', stats.gad7Mild],
    ['Moderate (10-14):', stats.gad7Moderate],
    ['Severe (15-21):', stats.gad7Severe],
    [''],
    ['Duration of Symptoms'],
    ['Few days:', stats.duration1],
    ['Few weeks:', stats.duration2],
    ['Few months:', stats.duration3],
    ['More than a year:', stats.duration4],
  ];
  
  summarySheet.getRange(1, 1, summaryData.length, 2).setValues(summaryData);
  
  // Format summary
  summarySheet.getRange('A1:B1')
    .merge()
    .setBackground('#4f46e5')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');
  
  summarySheet.getRange('A6:B6')
    .setBackground('#e0e7ff')
    .setFontWeight('bold');
  
  summarySheet.getRange('A12:B12')
    .setBackground('#e0e7ff')
    .setFontWeight('bold');
  
  summarySheet.getRange('A19:B19')
    .setBackground('#e0e7ff')
    .setFontWeight('bold');
  
  summarySheet.getRange('A26:B26')
    .setBackground('#e0e7ff')
    .setFontWeight('bold');
  
  summarySheet.autoResizeColumns(1, 2);
  
  ss.setActiveSheet(summarySheet);
  SpreadsheetApp.getUi().alert('Summary report generated!');
}

/**
 * Calculates statistics from the data
 */
function calculateStats(sheet, lastRow) {
  const stats = {
    totalSessions: lastRow - 1,
    highRiskCount: 0,
    riskQ1Count: 0,
    riskQ2Count: 0,
    riskQ3Count: 0,
    phq9Avg: 0,
    phq9Minimal: 0,
    phq9Mild: 0,
    phq9Moderate: 0,
    phq9ModSevere: 0,
    phq9Severe: 0,
    gad7Avg: 0,
    gad7Minimal: 0,
    gad7Mild: 0,
    gad7Moderate: 0,
    gad7Severe: 0,
    duration1: 0,
    duration2: 0,
    duration3: 0,
    duration4: 0
  };
  
  let phq9Sum = 0;
  let phq9Count = 0;
  let gad7Sum = 0;
  let gad7Count = 0;
  
  for (let i = 2; i <= lastRow; i++) {
    // Risk flags
    const riskQ1 = sheet.getRange(i, 4).getValue();
    const riskQ2 = sheet.getRange(i, 5).getValue();
    const riskQ3 = sheet.getRange(i, 6).getValue();
    
    if (riskQ1 === 'Yes') stats.riskQ1Count++;
    if (riskQ2 === 'Yes') stats.riskQ2Count++;
    if (riskQ3 === 'Yes') stats.riskQ3Count++;
    if (riskQ1 === 'Yes' || riskQ2 === 'Yes' || riskQ3 === 'Yes') {
      stats.highRiskCount++;
    }
    
    // PHQ-9 scores
    const phq9 = sheet.getRange(i, 16).getValue();
    if (typeof phq9 === 'number') {
      phq9Sum += phq9;
      phq9Count++;
      
      if (phq9 <= 4) stats.phq9Minimal++;
      else if (phq9 <= 9) stats.phq9Mild++;
      else if (phq9 <= 14) stats.phq9Moderate++;
      else if (phq9 <= 19) stats.phq9ModSevere++;
      else stats.phq9Severe++;
    }
    
    // GAD-7 scores
    const gad7 = sheet.getRange(i, 18).getValue();
    if (typeof gad7 === 'number') {
      gad7Sum += gad7;
      gad7Count++;
      
      if (gad7 <= 4) stats.gad7Minimal++;
      else if (gad7 <= 9) stats.gad7Mild++;
      else if (gad7 <= 14) stats.gad7Moderate++;
      else stats.gad7Severe++;
    }
    
    // Duration
    const duration = sheet.getRange(i, 11).getValue();
    if (duration === 1) stats.duration1++;
    else if (duration === 2) stats.duration2++;
    else if (duration === 3) stats.duration3++;
    else if (duration === 4) stats.duration4++;
  }
  
  stats.phq9Avg = phq9Count > 0 ? phq9Sum / phq9Count : 0;
  stats.gad7Avg = gad7Count > 0 ? gad7Sum / gad7Count : 0;
  
  return stats;
}

/**
 * Exports high-risk cases to a new sheet
 */
function exportHighRiskCases() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('Sheet1');
  
  if (!dataSheet) {
    SpreadsheetApp.getUi().alert('Sheet1 not found!');
    return;
  }
  
  const lastRow = dataSheet.getLastRow();
  const lastCol = dataSheet.getLastColumn();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No data found!');
    return;
  }
  
  // Create or clear high-risk sheet
  let riskSheet = ss.getSheetByName('High Risk Cases');
  if (riskSheet) {
    riskSheet.clear();
  } else {
    riskSheet = ss.insertSheet('High Risk Cases');
  }
  
  // Copy headers
  const headers = dataSheet.getRange(1, 1, 1, lastCol).getValues();
  riskSheet.getRange(1, 1, 1, lastCol).setValues(headers);
  
  // Format headers
  riskSheet.getRange(1, 1, 1, lastCol)
    .setBackground('#dc2626')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  
  // Copy high-risk rows
  let riskRowIndex = 2;
  for (let i = 2; i <= lastRow; i++) {
    const riskQ1 = dataSheet.getRange(i, 4).getValue();
    const riskQ2 = dataSheet.getRange(i, 5).getValue();
    const riskQ3 = dataSheet.getRange(i, 6).getValue();
    
    if (riskQ1 === 'Yes' || riskQ2 === 'Yes' || riskQ3 === 'Yes') {
      const rowData = dataSheet.getRange(i, 1, 1, lastCol).getValues();
      riskSheet.getRange(riskRowIndex, 1, 1, lastCol).setValues(rowData);
      riskRowIndex++;
    }
  }
  
  if (riskRowIndex === 2) {
    SpreadsheetApp.getUi().alert('No high-risk cases found!');
    return;
  }
  
  // Auto-resize columns
  for (let i = 1; i <= lastCol; i++) {
    riskSheet.autoResizeColumn(i);
  }
  
  riskSheet.setFrozenRows(1);
  
  ss.setActiveSheet(riskSheet);
  SpreadsheetApp.getUi().alert(`Found ${riskRowIndex - 2} high-risk case(s)!`);
}

/**
 * Displays statistics in a popup
 */
function calculateStatistics() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Sheet1 not found!');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No data to analyze!');
    return;
  }
  
  const stats = calculateStats(sheet, lastRow);
  
  const message = `
📊 STATISTICS SUMMARY

Total Sessions: ${stats.totalSessions}

🚨 Risk Assessment:
• High Risk Cases: ${stats.highRiskCount}
• Suicidal/Self-harm: ${stats.riskQ1Count}
• Physical Health: ${stats.riskQ2Count}
• Psychosis: ${stats.riskQ3Count}

📉 Depression (PHQ-9):
• Average Score: ${stats.phq9Avg.toFixed(2)}
• Minimal: ${stats.phq9Minimal}
• Mild: ${stats.phq9Mild}
• Moderate: ${stats.phq9Moderate}
• Mod-Severe: ${stats.phq9ModSevere}
• Severe: ${stats.phq9Severe}

😰 Anxiety (GAD-7):
• Average Score: ${stats.gad7Avg.toFixed(2)}
• Minimal: ${stats.gad7Minimal}
• Mild: ${stats.gad7Mild}
• Moderate: ${stats.gad7Moderate}
• Severe: ${stats.gad7Severe}
  `;
  
  SpreadsheetApp.getUi().alert('Statistics', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Protects the data range from accidental edits
 */
function protectDataRange() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Sheet1 not found!');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('No data to protect!');
    return;
  }
  
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Protect Data',
    'This will protect all existing data from accidental edits. Only sheet editors will be able to modify it. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  const range = sheet.getRange(2, 1, lastRow - 1, lastCol);
  const protection = range.protect().setDescription('Chat data protection');
  
  // Ensure the user who runs this script can still edit
  const me = Session.getEffectiveUser();
  protection.addEditor(me);
  protection.setWarningOnly(true); // Show warning but allow edits
  
  SpreadsheetApp.getUi().alert('Data protected! Editors will see a warning when trying to edit.');
}

/**
 * Creates a pivot table for analysis (advanced)
 */
function createPivotTable() {
  // Future enhancement: Create pivot tables for deeper analysis
  SpreadsheetApp.getUi().alert('This feature is coming soon!');
}
