# ChatGPT AI Scanner

A lightweight web app that lets you paste text and use ChatGPT to analyze it for summaries, risks, sentiment, or action items.

## Features
- Paste any text content
- Choose scan mode:
  - Summary
  - Risks
  - Sentiment
  - Action items
- Optional URL source tracking
- Clean, simple frontend
- Uses the OpenAI API for scanning

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=your_key_here
   PORT=3000
   ```

4. Start the app:
   ```bash
   npm start
   ```

5. Open:
   ```text
   http://localhost:3000
   ```

## Example scan modes
- Summary: get a straightforward overview of the content
- Risks: look for warning signs, concerns, or red flags
- Sentiment: determine tone and mood
- Action items: extract priorities and follow-ups

## Project structure
- `server.js` — Express app and OpenAI integration
- `public/index.html` — scanner UI
- `public/styles.css` — styling
- `public/app.js` — frontend logic

## Notes
This starter app is intentionally simple and easy to extend. You can add file upload, URL scraping, PDF parsing, or a database later.
