# Primary Care Mental Health Chatbot

This project implements a browser-based primary care mental health chatbot that:

- Handles common, lower-complexity mental health presentations (stress, anxiety, depression) in adults.
- Uses structured flows:
  - Safety gate (age + suicide/self-harm/psychosis/acute illness exclusion).
  - Calgary–Cambridge style ICE (Ideas, Concerns, Expectations).
  - Brief history (duration, triggers, impact, support, substances).
  - PHQ-9 and GAD-7 questionnaires with correct wording and scoring.
- Provides non-diagnostic, NICE-style step-care advice and a sharable summary.
- Includes a **ChatGPT-style animated circle avatar** that pulses when responding to questions.
- Has **optional ChatGPT integration** for follow-up Q&A with the virtual avatar.
- **Automatically saves chat data to Google Sheets** (optional) for record-keeping and analysis.

## Structure

- \`index.html\` – The entire frontend (UI, questionnaire logic, avatar panel, and client-side LLM hook).
- \`server.js\` – Node.js + Express backend exposing \`/api/chatgpt\` using the OpenAI Chat Completions API.
- \`package.json\` – Dependencies and start script.

## Prerequisites

- Node.js 18+ (recommended).
- An OpenAI API key with access to ChatGPT models.

## Setup

1. Install dependencies:

   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment variables:

   Copy \`.env.example\` to \`.env\` and fill in your credentials:

   \`\`\`bash
   cp .env.example .env
   \`\`\`

   Required:
   - \`OPENAI_API_KEY\` - Your OpenAI API key

   Optional (for Google Sheets logging):
   - \`GOOGLE_SHEETS_ID\` - Your Google Spreadsheet ID
   - \`GOOGLE_SERVICE_ACCOUNT_EMAIL\` - Service account email
   - \`GOOGLE_PRIVATE_KEY\` - Service account private key

   See \`GOOGLE_SHEETS_SETUP.md\` for detailed Google Sheets integration instructions.

3. Start the server:

   \`\`\`bash
   npm start
   \`\`\`

4. Open the chatbot in your browser:

   - Go to: <http://localhost:3000>

The backend will serve \`index.html\` and handle \`POST /api/chatgpt\` for avatar-mode questions.

## Features

### Animated Avatar

- The chatbot features a ChatGPT-style animated circle avatar
- The avatar pulses (grows and shrinks) when responding to questions
- Animation duration is based on response length for a natural feel

### Google Sheets Integration

- All completed chat sessions are automatically saved to Google Sheets
- Includes: timestamps, session IDs, safety responses, questionnaire scores, and avatar chat history
- Optional feature - works without configuration but requires setup for logging
- See \`GOOGLE_SHEETS_SETUP.md\` for detailed setup instructions

> **Important:** Never misrepresent the avatar as a real doctor. Chat data contains sensitive health information - ensure proper security and compliance.

## Safety and scope

- The chatbot does **not**:
  - Handle under-18s.
  - Provide emergency or crisis care.
  - Manage active suicidal/self-harm thoughts, intent to harm others, psychosis, or acute severe medical symptoms.
  - Provide diagnoses or change medications.

- If such risks are detected, the chat **immediately stops** and signposts to urgent help.

Always test with clinicians and align with local governance / DTAC requirements before using in real clinical workflows.