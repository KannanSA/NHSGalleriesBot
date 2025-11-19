# Voice Mode Usage Guide

## 🎤 How to Use Voice Mode

### Quick Start
1. **Start the server**:
   ```powershell
   node server.js
   ```

2. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - **Recommended browsers**: Chrome, Edge, or Safari (best speech recognition support)
   - **Not supported**: Firefox (doesn't support Web Speech API)

3. **Activate voice mode**:
   - Click **"Talk to the avatar doctor"** button
   - The avatar circle will turn **green** and voice controls will appear
   - You'll see two buttons:
     - 🎤 **Microphone button** - Start voice input
     - 🔇 **Stop button** - Stop the avatar from speaking

### Using Voice Input

1. **Click the microphone button** (🎤)
2. **Allow microphone access** when your browser prompts you
3. The avatar circle will turn **BLUE** and show "Listening..."
4. **Speak your question or message**
5. When you stop speaking, it will:
   - Transcribe your speech to text
   - Send it to ChatGPT
   - The avatar circle turns **GREEN** and pulses while responding
   - You'll hear the response spoken aloud

### Visual Feedback

- **Green pulsing circle** = Avatar is speaking
- **Blue pulsing circle** = Listening to your voice
- **Static green circle** = Ready and waiting
- **Microphone button recording** = Red highlight when active

### Controls

- **🎤 Microphone** - Click to start voice input
- **🔇 Stop** - Click to interrupt the avatar's speech (appears while speaking)
- **"Talk to the avatar doctor"** - Toggle between avatar chat and structured questionnaire

## Troubleshooting

### Voice input not working?
1. **Check browser compatibility**: Use Chrome, Edge, or Safari
2. **Check microphone permissions**: 
   - Click the lock icon in your browser's address bar
   - Ensure microphone is allowed for localhost
3. **Check console**: Press F12 and look for errors in the Console tab

### No sound output?
1. **Check volume**: Ensure your system volume is up
2. **Check browser settings**: Some browsers require user interaction before playing audio
3. **Try clicking stop and starting again**: Sometimes the speech synthesis needs to be reinitialized

### "Voice input not supported" message?
- You're using an unsupported browser (likely Firefox)
- Solution: Switch to Chrome, Edge, or Safari
- Fallback: Use text input instead

## Features

✅ **Hands-free interaction** - Speak naturally to the avatar  
✅ **Real-time transcription** - Your speech is converted to text instantly  
✅ **Natural voice responses** - ChatGPT responses are spoken aloud  
✅ **Visual feedback** - See when the avatar is listening vs. speaking  
✅ **Interrupt capability** - Stop the avatar mid-sentence if needed  
✅ **Automatic mode switching** - Seamlessly switch between voice and text input  

## Technical Details

### Speech Recognition
- **API**: Web Speech API (SpeechRecognition)
- **Language**: English (US)
- **Mode**: Single utterance (stops after each sentence)
- **Browser Support**: Chrome, Edge, Safari (WebKit)

### Text-to-Speech
- **API**: Web Speech API (SpeechSynthesis)
- **Language**: English (US)
- **Rate**: 1.0 (normal speed)
- **Pitch**: 1.0 (normal pitch)

### Backend Integration
- **AI Model**: GPT-4.1-mini (OpenAI)
- **System Prompt**: Configured as NHS Virtual GP
- **Response Storage**: Logged to Google Sheets
- **Session Tracking**: Unique session ID per conversation

## Tips for Best Experience

1. **Speak clearly** and at a normal pace
2. **Reduce background noise** for better recognition
3. **Wait for the blue circle** before speaking
4. **Use headphones** to prevent echo/feedback
5. **Keep sentences concise** for faster processing

## Privacy & Data

- All conversations are logged to Google Sheets
- Session ID, timestamps, and full chat history are saved
- Voice audio is processed by browser's speech API (not recorded)
- Text is sent to OpenAI API for responses

---

**Need help?** Check the browser console (F12) for detailed error messages.
