# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets to save chat conversations from the Mental Health Chatbot.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Mental Health Chatbot")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter a name (e.g., "chatbot-sheets-writer")
4. Click "Create and Continue"
5. For role, select "Editor" (or you can create a custom role with just Sheets access)
6. Click "Continue" → "Done"

## Step 4: Generate Service Account Key

1. In the "Credentials" page, find your service account under "Service Accounts"
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" → "Create new key"
5. Choose "JSON" format
6. Click "Create" - this will download a JSON file

## Step 5: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "Mental Health Chat Logs")
4. Add headers in the first row:
   - A1: Timestamp
   - B1: Session ID
   - C1: Age 18+
   - D1: Risk Q1 (Suicidal/Self-harm)
   - E1: Risk Q2 (Physical)
   - F1: Risk Q3 (Psychosis)
   - G1: Main Story
   - H1: Ideas
   - I1: Concerns
   - J1: Expectations
   - K1: Duration
   - L1: Triggers
   - M1: Impact
   - N1: Support
   - O1: Substances
   - P1: PHQ-9 Score
   - Q1: PHQ-9 Impact
   - R1: GAD-7 Score
   - S1: GAD-7 Impact
   - T1: Avatar Chat History

5. Share the sheet with your service account:
   - Click "Share" button
   - Paste the service account email (from the JSON file: `client_email`)
   - Give it "Editor" access
   - Uncheck "Notify people"
   - Click "Share"

6. Copy the Spreadsheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - Copy the `{SPREADSHEET_ID}` part

## Step 6: Configure Environment Variables

Create a `.env` file in your project root with the following:

```env
# OpenAI API Key (for ChatGPT integration)
OPENAI_API_KEY=your_openai_api_key_here

# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Get `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` from the JSON file you downloaded
- The private key must be in quotes and include the `\n` characters as shown
- Make sure to add `.env` to your `.gitignore` file to keep credentials secure

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Update server.js to Load Environment Variables

Add this at the top of `server.js`:

```javascript
import 'dotenv/config';
```

Then install dotenv:

```bash
npm install dotenv
```

## Step 9: Start the Server

```bash
npm start
```

The server will log whether Google Sheets integration is enabled.

## Data Saved

Each completed chat session saves:
- Timestamp
- Unique session ID
- All safety screening responses
- ICE (Ideas, Concerns, Expectations)
- Brief history responses
- PHQ-9 and GAD-7 scores
- Functional impact ratings
- Avatar chat history (if used)

## Privacy & Security Notes

⚠️ **Important:** This data contains sensitive health information. Ensure:
- The Google Sheet is NOT publicly shared
- Only authorized personnel have access
- You comply with HIPAA, GDPR, or relevant data protection regulations
- Service account credentials are kept secure
- Consider encrypting sensitive fields
- Have a data retention and deletion policy

## Troubleshooting

**"Google Sheets integration disabled"**
- Check that all three environment variables are set correctly
- Verify the service account email and private key match the JSON file

**"Failed to save to Google Sheets"**
- Verify the spreadsheet is shared with the service account email
- Check the spreadsheet ID is correct
- Ensure the Google Sheets API is enabled in your project

**"Error: invalid_grant"**
- The private key format might be incorrect
- Make sure newlines are represented as `\n` in the .env file
- Try copying the entire private key again from the JSON file

## Step 10: Add Google Apps Script (Optional but Recommended)

The included `google-sheets-script.gs` file provides helpful automation for your sheet:

### Features:
- ✅ Automatic header setup and formatting
- ✅ Conditional formatting (highlights high-risk cases in red)
- ✅ Summary report generation with statistics
- ✅ Export high-risk cases to separate sheet
- ✅ Calculate PHQ-9 and GAD-7 distribution
- ✅ Data protection tools

### Installation:

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete any existing code in the editor
4. Open the `google-sheets-script.gs` file from this project
5. Copy all the code
6. Paste it into the Apps Script editor
7. Click the **Save** icon (💾)
8. Click **Run** → Select **onOpen**
9. Authorize the script when prompted:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [project name] (unsafe)"
   - Click "Allow"
10. Close the Apps Script tab and refresh your Google Sheet

### Using the Script:

After installation, you'll see a new **"Chatbot Tools"** menu in your sheet with these options:

- **Setup Headers** - Automatically creates and formats the header row
- **Format Sheet** - Applies color coding and conditional formatting
- **Generate Summary Report** - Creates a statistics summary in a new sheet
- **Export High-Risk Cases** - Copies all high-risk sessions to a separate sheet
- **Calculate Statistics** - Shows quick stats in a popup
- **Protect Data** - Adds protection to prevent accidental edits

### Recommended Usage:

1. Run **"Setup Headers"** first (only needed once)
2. Run **"Format Sheet"** after new data is added to highlight important cases
3. Use **"Generate Summary Report"** weekly/monthly for analytics
4. Use **"Export High-Risk Cases"** to quickly identify sessions needing follow-up
