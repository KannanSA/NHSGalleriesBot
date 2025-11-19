# NHS Mental Health Chatbot - Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at vercel.com)
- Vercel CLI installed: `npm install -g vercel`
- Your environment variables ready

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```powershell
npm install -g vercel
```

### 2. Login to Vercel
```powershell
vercel login
```

### 3. Deploy to Vercel
Navigate to your project directory and run:
```powershell
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? `nhs-chatbot` (or your choice)
- In which directory is your code located? **./** (press Enter)
- Want to override the settings? **N**

### 4. Configure Environment Variables

After deployment, add your environment variables in Vercel Dashboard or via CLI:

```powershell
vercel env add OPENAI_API_KEY
# Paste your OpenAI API key when prompted

vercel env add GOOGLE_SHEETS_ID
# Paste: 1vG4DhY1uwXHp5nRsGU8RjR4JDrt4Ckch67TDmipNQN8

vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
# Paste: nhschatbot@nhschatbot.iam.gserviceaccount.com

vercel env add GOOGLE_PRIVATE_KEY
# Paste the full private key from your service account JSON
```

**Important for GOOGLE_PRIVATE_KEY:**
- Keep the quotes and `\n` characters
- Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvg...\n-----END PRIVATE KEY-----\n"`

### 5. Redeploy with Environment Variables
```powershell
vercel --prod
```

## Alternative: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Configure project:
   - Framework Preset: **Other**
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`
4. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env` file
5. Click **Deploy**

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-proj-...` |
| `GOOGLE_SHEETS_ID` | Google Sheets spreadsheet ID | `1vG4DhY1uwXHp5nRsGU8RjR4JDrt4Ckch67TDmipNQN8` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | `nhschatbot@nhschatbot.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Service account private key | `"-----BEGIN PRIVATE KEY-----\n...` |

## Troubleshooting

### Build Fails
- Check that `package.json` has all dependencies
- Ensure `"type": "module"` is in `package.json`

### API Routes Not Working
- Verify `vercel.json` is present
- Check that environment variables are set for Production environment

### Google Sheets Not Saving
- Verify `GOOGLE_PRIVATE_KEY` includes the full key with quotes and `\n` characters
- Check Vercel logs: `vercel logs`

### Voice Mode Issues
- Voice recognition requires HTTPS (Vercel provides this automatically)
- Microphone permissions must be granted by user
- Check browser console for errors

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed

## Production URL

After deployment, your app will be available at:
```
https://your-project-name.vercel.app
```

## Monitoring

View logs and analytics:
```powershell
vercel logs
```

Or check the Vercel Dashboard at https://vercel.com/dashboard

## Updating Your Deployment

To deploy updates:
```powershell
vercel --prod
```

## Local Development

Continue developing locally:
```powershell
npm start
```

Your local environment uses the `.env` file, while Vercel uses environment variables configured in the dashboard.
