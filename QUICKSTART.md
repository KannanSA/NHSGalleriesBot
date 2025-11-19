# Quick Start Guide

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the project root:

```env
# Required
OPENAI_API_KEY=sk-your-openai-key-here

# Optional - for Google Sheets logging
GOOGLE_SHEETS_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

PORT=3000
```

## Run the Application

```bash
npm start
```

Then open: http://localhost:3000

## Google Sheets Setup (Optional)

If you want to save chat logs to Google Sheets:

1. **Create Google Cloud Project** → Enable Google Sheets API
2. **Create Service Account** → Download JSON credentials
3. **Create Google Sheet** → Share with service account email
4. **Add credentials to `.env`** from the JSON file
5. **Restart server**

See `GOOGLE_SHEETS_SETUP.md` for detailed instructions.

## Features

✅ PHQ-9 and GAD-7 questionnaires
✅ Safety screening and crisis detection
✅ ChatGPT-powered avatar chat
✅ Animated circle avatar (pulses when talking)
✅ Automatic data logging to Google Sheets
✅ Sharable summary for healthcare providers

## Security Notes

⚠️ **Never commit `.env` file to version control**
⚠️ **Ensure Google Sheets are private and compliant with regulations**
⚠️ **This is NOT a replacement for professional medical care**
