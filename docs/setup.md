# Setup and Run Instructions

[Back to README](../README.md)

This guide helps reviewers and developers get Outstand running locally in under 5 minutes.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | v20.x or v22.x | Required for Vite runtime and dependencies |
| npm | v10.x or higher | Comes bundled with Node.js |
| Modern Web Browser | Chrome, Firefox, Safari, or Edge | For running the application |

## 1. Clone the Repository

```bash
git clone https://github.com/agnidevaraja/SyntaxError404-Phase2.git
cd SyntaxError404-Phase2/frontend
```

## 2. Environment Variables

The frontend application requires configuration keys for Firebase and Google Gemini.
In the `frontend/` directory, create or check the `.env` file:

```bash
# In frontend/.env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_OPPORTUNITIES_API_KEY=your_gemini_opportunities_api_key
```

| Variable | Required | Example Value | Purpose |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | Yes | AIzaSy... | Authenticates Firebase Web SDK requests |
| `VITE_FIREBASE_PROJECT_ID` | Yes | syntaxerror404-phase2 | Specifies target Cloud Firestore project |
| `VITE_GEMINI_API_KEY` | Recommended | AIzaSy... | Powers Gemini 3.8 Flash for facilitator advisory and concept explanations |
| `VITE_GEMINI_OPPORTUNITIES_API_KEY` | Recommended | AIzaSy... | Powers Gemini 3.8 Flash for Student Hub AI opportunity search & Olympiad curation |

Note: If API keys are not supplied or run into network limits, Outstand automatically activates its built-in pedagogical fallback engine and verified 2026 opportunity directory so all student and teacher features remain fully testable.

## 3. Install Dependencies

```bash
npm install
```

All required mock student cohort data, Grade 9 Chemistry curriculum nodes, and Grade 9 Economics units are already bundled inside `frontend/src/data/`, so no separate database seeding script is required.

## 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

### Quick Demo Accounts

You can test either persona instantly from the landing page without signing up manually:
- **Student Persona**: Click "Launch Student Demo" on the landing page, or click "Quick Fill Demo (Student: Alex Chen)" in the sign-in modal.
- **Chemistry Facilitator Persona**: Click "Launch Facilitator Demo", choose Chemistry, or quick fill "Dr. Eleanor Vance".
- **Economics Facilitator Persona**: In the Facilitator portal, switch subjects or quick fill "Prof. Arthur Sterling".

## Testing Offline Mode

To verify offline resilience:

1. Open Outstand in Google Chrome and log in as a Student.
2. Complete a diagnostic assessment or navigate to the Personalized Learning Space.
3. Open Chrome DevTools (`F12` or `Ctrl+Shift+I` on Windows, `Cmd+Option+I` on macOS).
4. Click on the **Network** tab, find the dropdown menu that currently says "No throttling", and select **Offline**.
5. Click between focus areas, open the slide preview deck, review the Gentner analogy boundary cards, and test the practice exercises.
6. Notice that the entire learning environment remains responsive, and clicking "Break It Down with AI" delivers a high-quality pedagogical breakdown from the local curriculum fallback.
7. Switch back to "No throttling" to restore live Firestore synchronization.

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Port 3000 already in use | Another application or previous Vite process is running | Vite will automatically suggest port 3001. Check terminal output for the active URL or run `npm run dev -- --port 3005`. |
| Firebase authentication popup blocked | Browser pop-up blocker enabled for localhost | Click the pop-up icon in the browser address bar and choose "Always allow pop-ups for localhost", or test with email/password quick-fill. |
| Blank screen on load | Node modules out of sync | Run `rm -rf node_modules package-lock.json && npm install`. |
| Build verification check | Confirming production build compiles without errors | Run `npm run build` inside `frontend/`. It should exit with code 0. |
