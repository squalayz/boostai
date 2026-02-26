# ONBOARDING WIZARD + MOONBASE CHART

Read `src/app/page.tsx` fully first. Understand ALL existing views, state, and components.

## TASK 1: POST-DEPLOY ONBOARDING WIZARD

Currently after deploying an agent, the user sees a simple "ENTER COCKPIT" button. Replace this with a 3-slide wizard that teaches them everything.

### After deploy completes (where `onDeploy` fires and modal="deployed"), replace the current deployed modal content with:

**Slide 1: "YOUR AGENT IS ALIVE"**
- Show the creature SVG (use existing Creature component with their chosen type)
- Agent name + personality name in big text
- Agent wallet address with copy button
- "This is your AI trader. It thinks, learns, and trades $BOOST 24/7."
- Button: "NEXT" →

**Slide 2: "FUEL YOUR AGENT"**
- Big deposit address box with copy button
- Suggested amounts: "0.01 ETH (~$26)" / "0.05 ETH (~$130)" / "0.1 ETH (~$260)"
- "Send Base ETH to this address. Your agent uses it to buy and sell $BOOST."
- "No ETH? Buy on Coinbase and send to Base network."
- Important: Show the private key (blurred, click to reveal) with WARNING text
- "SAVE THIS KEY — it's the only way to recover funds if you lose access"
- Button: "NEXT" →

**Slide 3: "TALK TO YOUR AGENT"**
- Show a fake chat UI preview with example messages:
  - User: "buy now" → Agent: "BOUGHT with 0.005 ETH! SPARK mode activated."
  - User: "how are we doing?" → Agent: "SPARK reporting in. ETH: 0.045 | BOOST: 12.4M"
  - User: "sell half" → Agent: "Sold 50% — 6.2M BOOST back to ETH. Profit secured."
  - User: "take profit" → Agent: "Sold 50%..."
  - User: "cash out" → Agent: "Sold 95%..."
  - User: "full send" → Agent: "BOUGHT with 80% of ETH!"
  - User: "chill" → Agent: "Standing down. Manual mode."
  - User: "go" → Agent: "ONLINE. Let's eat."
- "Your agent also trades automatically based on its personality. You're always in control."
- Button: "ENTER COCKPIT" → goes to cockpit view

### Wizard styling:
- Same retro dark theme as everything else
- Slide indicator dots at top (3 dots, current = cyan)
- Smooth fade transition between slides
- Max-width 420px, centered
- Press Start 2P font throughout

## TASK 2: MOONBASE PRICE CHART

Add a live price chart BEHIND the agents on the Moonbase view.

### Implementation:
- Use a simple SVG line chart (NO external chart libraries)
- Position it as a background element behind the agent creatures
- Semi-transparent so agents are clearly visible on top (opacity 0.15-0.25)
- Shows BOOST price over time
- Green line color (#34d399), with gradient fill below the line (#34d39910)
- Grid lines very faint (#ffffff08)

### Data source:
- Store price history in state: `priceHistory: {time: number, price: number}[]`
- On moonbase load, start polling `/api/chain` every 15 seconds
- Push new `{time: Date.now(), price: data.price}` to history
- Show last 50 data points
- Auto-scale Y axis to min/max of data
- If only 1 data point, show flat line

### Chart positioning:
- Absolutely positioned behind the moonscape
- Full width, ~40% height of the moonbase area
- Bottom-aligned (chart grows from bottom up, like a horizon)
- Z-index behind agents but above the star background

### Chart labels (very subtle, opacity 0.3):
- Current price in top-right corner: "$0.0000000819"
- "BOOST/ETH" label in top-left

## TASK 3: NAV IMPROVEMENTS

- After user has created at least 1 agent, show "COCKPIT" in the nav bar (already done, verify it works)
- Make COCKPIT the default nav highlight when an agent exists
- On the home page, if user already has agents, show "ENTER COCKPIT" as the primary CTA instead of "DEPLOY AGENT"

## RULES:
- Keep ALL existing functionality exactly as-is
- All in one file: src/app/page.tsx
- Must pass: npx next build
- TypeScript: use `any` types freely
- ZERO new dependencies
- Press Start 2P font, retro dark theme
- Colors: green #34d399, red #f87171, cyan #22d3ee, purple #a855f7, dark bg #0a0a1a

When completely finished and build passes, run: openclaw system event --text "Done: Onboarding wizard + Moonbase chart + nav improvements" --mode now
