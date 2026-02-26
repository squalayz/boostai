# COCKPIT UI — The Agent Game Boy

Read `src/app/page.tsx` first. Understand the full codebase. You are building a NEW view called "cockpit" that replaces the current HQ/dashboard.

## THE CONCEPT
Each user has ONE agent. The cockpit is their window into that agent's world — like a Game Boy screen showing their living, breathing AI trader.

## Server API (LIVE at https://boostai-server-production.up.railway.app):
- GET /api/agents — all agents
- GET /api/agents/:address — single agent with balance
- POST /api/agents/create — { name, type, personality } → creates agent
- POST /api/agents/:address/chat — { message } → agent responds + executes commands
  - "buy now" / "full send" / "attack" → agent buys BOOST
  - "sell half" / "take profit" / "cash out" → agent sells BOOST
  - "status" / "how are we doing?" → P&L report
  - "chill" / "pause" → stop auto-trading
  - "go" / "start" / "aggressive" → resume auto-trading
- GET /api/chain — { supply, liquidity, pairTokens, tradingEnabled, agentCount, price }

## COCKPIT VIEW (view="cockpit")
After creating an agent, user lands here. This is the main experience.

### Layout — Game Boy Card (centered, max-width 420px, mobile-first)
```
┌──────────────────────────────────────┐
│  [Agent Name]          [ETH Balance] │
│  [Type/Personality]    [BOOST Bal]   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  │     [CREATURE SVG]           │   │
│  │     floating, breathing      │   │
│  │     green glow = buying      │   │
│  │     red glow = selling       │   │
│  │     sparkle = in profit      │   │
│  │     shake = losing           │   │
│  │                              │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ Agent activity feed:         │   │
│  │ "Spotted a dip. Going in..." │   │
│  │ "Bought 12M BOOST ✓"        │   │
│  │ "Holding. Patience is alpha" │   │
│  │ "Price up 8%. Diamond hands" │   │
│  └──────────────────────────────┘   │
│                                      │
│  P&L: +0.004 ETH (+12%)            │
│  BOOST: 48,200,000                  │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ > talk to your agent...      │   │
│  └──────────────────────────────┘   │
│                                      │
│  [BOOST 🔥]  [WITHDRAW]  [FUND ⛽]  │
│                                      │
└──────────────────────────────────────┘
```

### Creature Display
- Use the existing Creature SVG component (already in codebase)
- Add CSS animations:
  - Default: gentle float up/down (translateY -3px to 3px, 3s ease-in-out infinite)
  - Buying: green glow (box-shadow: 0 0 20px #34d399, filter: drop-shadow(0 0 8px #34d399))
  - Selling: red pulse (box-shadow: 0 0 20px #f87171, scale 0.95→1.05)
  - In profit: sparkle particles (CSS keyframe dots around creature)
  - Losing: slight shake (translateX -2px to 2px)
- Creature state driven by latest trade action + P&L

### Activity Feed
- Scrollable div, max-height 180px, auto-scroll to bottom
- Each message from the agent in their personality voice
- Poll GET /api/agents/:address every 15 seconds for new data
- On balance change → add a feed message (bought/sold/holding)
- Messages styled like retro game text: green for buys, red for sells, white for holds
- Font: Press Start 2P, 7px

### Chat Input
- Bottom text input with retro styling
- On submit: POST /api/agents/:address/chat with { message }
- Show agent's response in the feed
- Placeholder: "talk to your agent..."
- Auto-focus on load

### Action Buttons (bottom row)
- **BOOST 🔥** — Quick buy. Sends "buy now" to chat endpoint. Button glows orange.
- **WITHDRAW** — Shows a modal: "To withdraw ETH, tell your agent: 'sell all' then send ETH from your agent wallet to your personal wallet." Show the agent's private key (blurred, click to reveal) + copy button + MetaMask import instructions. WARNING text about saving keys.
- **FUND ⛽** — Shows deposit address with copy button. "Send Base ETH to this address to fuel your agent."

### P&L Display
- Calculate from initial ETH deposited vs current (ETH + BOOST value)
- Show in green if positive, red if negative
- Update every 15 seconds with the poll

### Navigation Flow
1. Home page → "DEPLOY AGENT" button (prominent, above fold)
2. Deploy → Pick creature → Name it → Agent created
3. Immediately show FUND modal with deposit address
4. After funding detected (poll balance), transition to COCKPIT
5. Cockpit is now their HOME — nav shows: HOME | ARENA | COCKPIT

### Mobile Optimization
- Cockpit card: 100% width on mobile, max-width 420px on desktop
- Chat input sticky at bottom on mobile
- Feed scrollable with momentum scroll
- Buttons large enough for thumbs (min 44px height)

## CRITICAL RULES
- ZERO EMOJIS in code (use text only for emojis in UI strings)
- Keep existing Creature SVG component exactly as-is
- Keep existing landing page (home view) exactly as-is
- Keep existing arena/moonbase view exactly as-is
- Keep intro lightning animation exactly as-is
- All in one file: src/app/page.tsx
- Must pass: npx next build
- TypeScript: use `any` types freely
- Style: retro game aesthetic, dark background, Press Start 2P font
- Colors: green #34d399, red #f87171, cyan #22d3ee, dark bg #0a0a1a

When completely finished and build passes, run: openclaw system event --text "Done: Cockpit UI with chat commands, creature animations, P&L, fund/withdraw" --mode now
