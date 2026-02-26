# TASK: BoostAI Agent Brain Architecture + Voice Cockpit

## Overview
Rebuild BoostAI so users bring their own AI API key. One user = one agent = one profile. Add voice walkie-talkie to the Game Boy cockpit.

## Architecture Change

### Current Flow
User → Chat text → Our server (server-side AI) → Execute trade

### New Flow  
User → Chat text OR voice → Frontend calls user's AI provider directly → Frontend sends trade command to our server → Server executes on-chain

**The server becomes a dumb execution layer. The brain lives client-side, powered by the user's own API key.**

## Changes to `src/app/page.tsx` (single file, all code here)

### 1. Remove Agent Type Selection (BOOSTY/BOOSTER/etc)
- Remove the 5 preset agent types (BOOSTY, BOOSTER, BOOSTIN, BOOSTMAN, BOOSTGIRL)
- Keep the Creature SVG component but make it randomly assigned or user-chosen cosmetically
- Agent creation flow becomes: Pick name → Deploy → Setup API key

### 2. Add API Key Setup Screen
After agent deployment, show an "API Key Setup" screen:
- Provider selector: OpenAI, Anthropic, Grok/xAI, Groq, Google, OpenRouter
- API key input field (password type, show/hide toggle)
- Model selector (auto-populated based on provider):
  - OpenAI: gpt-4o, gpt-4o-mini, gpt-4-turbo
  - Anthropic: claude-sonnet-4-20250514, claude-opus-4-6, claude-3-haiku
  - Grok: grok-2, grok-2-mini
  - Groq: llama-3.1-70b, mixtral-8x7b
  - Google: gemini-2.0-flash, gemini-1.5-pro
  - OpenRouter: any model string
- Personality prompt textarea (default provided, user can customize)
- "TEST CONNECTION" button that makes a simple API call to verify the key works
- Store in localStorage alongside agent data (key: `boostai_agent_brain`)
- **NEVER send API key to our server**

### 3. Client-Side AI Chat (the brain)
Create a function `agentChat(userMessage, context)` that:
- Builds a system prompt with trading context:
  ```
  You are [AGENT_NAME], an AI trading agent on BoostAI ($BOOST token on Base L2).
  You can execute these actions by responding with JSON:
  - {"action":"buy","amount":"0.001"} — buy BOOST with ETH amount
  - {"action":"sell","percent":50} — sell percentage of BOOST holdings
  - {"action":"dca","amount":"0.001","interval":"1h"} — set up DCA
  - {"action":"none"} — just chat, no trade
  
  Current state:
  - ETH balance: [X]
  - BOOST balance: [X]  
  - BOOST price: [X]
  - Portfolio value: [X]
  
  [USER'S CUSTOM PERSONALITY PROMPT]
  ```
- Calls the user's AI provider directly from the browser (CORS note: OpenAI/Anthropic support browser calls)
- Parses the response for action JSON
- If action found, calls our server API to execute
- Returns the chat response text

Provider API endpoints:
- OpenAI: `https://api.openai.com/v1/chat/completions`
- Anthropic: `https://api.anthropic.com/v1/messages` (needs `anthropic-dangerous-direct-browser-access: true` header)
- Grok: `https://api.x.ai/v1/chat/completions` (OpenAI-compatible)
- Groq: `https://api.groq.com/openai/v1/chat/completions` (OpenAI-compatible)
- Google: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}`
- OpenRouter: `https://openrouter.ai/api/v1/chat/completions`

### 4. Voice Walkie-Talkie on Cockpit
Add a walkie-talkie button to the cockpit Game Boy card:
- Round button with radio/mic icon, positioned below the chat input
- **Push-to-talk**: Hold button (mouse/touch) to record, release to send
- Use Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) for speech-to-text
- When recording: button pulses red, shows "TRANSMITTING..." text, retro static effect
- When processing: shows "PROCESSING..." 
- Transcribed text goes through same `agentChat()` pipeline
- Agent response optionally read aloud via Web Speech Synthesis API
- Style: retro radio aesthetic, dark metal button, LED indicator

### 5. One Agent Per Device
- On app load, check localStorage for existing agent
- If agent exists: skip creation, go straight to cockpit
- If no agent: show creation flow
- Remove ability to create multiple agents
- Dashboard (HQ) becomes single-agent view
- "MOONBASE" arena still shows all agents from server

### 6. Simplified Flow
```
First visit:  LANDING → PICK NAME → DEPLOY → API KEY SETUP → COCKPIT
Return visit:  LANDING → COCKPIT (auto-enter)
No API key:   Can still view cockpit, fund agent, see stats. Just can't chat/trade via AI.
              Manual BOOST/WITHDRAW buttons still work.
```

### 7. Updated Cockpit Layout (Game Boy card, max-width 420px)
```
┌─────────────────────────────┐
│  [AGENT_NAME]  ◉ CONNECTED  │  ← agent name + AI status indicator
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   [CREATURE SVG]    │    │  ← creature with mood animations
│  │                     │    │
│  └─────────────────────┘    │
│  ETH: 0.005  BOOST: 14.2M  │  ← balance bar
│  PnL: +12.5%               │
│  ┌─────────────────────┐    │
│  │ > bought 500K BOOST │    │  ← chat/activity feed
│  │ > price up 3%!      │    │
│  │ YOU: buy more       │    │
│  │ > going in! buying  │    │
│  └─────────────────────┘    │
│  [chat input...    ] [SEND] │  ← text input
│  [🎙️ HOLD TO TALK        ] │  ← walkie-talkie button (use text not emoji in code)
│  [BOOST] [WITHDRAW] [FUND] │  ← action buttons
│  [gear] [key] [brain]      │  ← settings, view key, AI config
└─────────────────────────────┘
```

### 8. API Key Management UI
Add a "brain" button (gear/brain icon) in cockpit that opens AI config modal:
- Shows current provider + model
- Change API key
- Change model
- Edit personality prompt
- Test connection button
- Clear brain (remove API key)

## Style Rules
- Keep ALL existing styling: Press Start 2P font, #0a0a1a bg, retro game aesthetic
- Keep SpaceCanvas background
- Keep all existing color scheme (#a855f7 purple, #22d3ee cyan, #34d399 green, #f87171 red)
- Keep GameCard, PixBtn, HudStat components
- Zero emojis in code (use text SVG icons or text labels)
- Mobile-first, max-width 420px for cockpit card
- All code in single file `src/app/page.tsx`

## Server-Side Changes Needed (DO NOT DO THESE — just note them)
- `/api/agents/:address/chat` should accept `{action:"buy",amount:"0.001"}` directly (no AI processing)
- Or create new endpoint `/api/agents/:address/execute` for pure trade execution
- Server no longer needs to run AI — just execute trades

## DO NOT
- Do not create new files. Everything in `src/app/page.tsx`
- Do not use emojis in code
- Do not remove the SpaceCanvas or creature SVGs
- Do not change contract addresses or API URLs
- Do not add npm dependencies (use built-in Web APIs for speech)
- Do not send API keys to the server

## Build & Test
```bash
cd /Users/pasqualeceli/Projects/boostai
npx next build
```
Must pass with zero errors (warnings OK).
