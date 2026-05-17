# Implementation Plan: Communities (Gatekeeper) Section Remake

## Objective
Transform the Communities section into a high-impact, scroll-driven GSAP narrative. Replace the static side-by-side comparison with a sequential story: a centralized server asserting control, followed by its destruction, and the emergence of a decentralized, cryptographically enforced mesh network.

## Key Files & Context
- `src/components/sections/CommunitiesSection.jsx`
- `src/components/sections/CommunitiesSection.module.css`

## Implementation Steps

### 1. CSS Structure Updates (`CommunitiesSection.module.css`)
- **Container:** Ensure the main `.section` is positioned relatively and hides overflow.
- **Narrative Container (`.narrativeContainer`):** Create a flex/grid container to hold the visual elements, ensuring it supports pinning.
- **Visual Assets:**
  - Define styles for the `.centralServer` (red/amber, imposing).
  - Define styles for the `.meshNetwork` (nodes connected by lines, green/accent).
  - Define styles for the `.terminalLog` to display GSAP TextPlugin outputs with the blinking cursor effect.
  - Remove old `.col`, `.colHeader`, and side-by-side `.diagram` classes.

### 2. Component Structure (`CommunitiesSection.jsx`)
- Refactor the JSX to house the new narrative elements:
  - A fixed/pinned container for the visual storytelling.
  - The centralized server element.
  - The decentralized mesh nodes elements.
  - A dedicated `div` for the terminal logs.

### 3. GSAP Timeline (`useGSAP` in `CommunitiesSection.jsx`)
- **Setup:** Register `ScrollTrigger` and `TextPlugin`. Set initial states (Server visible, Mesh hidden, Terminal empty).
- **Timeline Creation:** Create a `master` timeline with `ScrollTrigger` (pinning the section, scrub: 1, `end: '+=400%'`).
- **Sequence:**
  1. **Phase 1: The Gatekeeper:**
     - Type in terminal: `> Establishing connection to Central Server...`
     - Pulse animation on the `.centralServer`.
     - Type in terminal: `> Server verifying Admin permissions... > Server approved.`
  2. **Phase 2: The Fall:**
     - Type in terminal: `> Central point of failure detected...`
     - Animate the `.centralServer` collapsing (scale down to 0, fade to red, blur).
  3. **Phase 3: The Math (Lethon):**
     - Type in terminal: `> Initiating decentralized mesh...`
     - Reveal `.meshNetwork` nodes organically.
     - Type in terminal: `> Verifying Ed25519 signatures locally... > Math approved.`
  4. **Phase 4: Conclusion:**
     - Highlight the final sub-headline: "Cryptography doesn't have an office."

## Verification & Testing
- **Scroll Behavior:** Ensure the section pins correctly and the animation progresses smoothly with scroll.
- **Responsiveness:** Verify the layout and font sizes using the existing `clamp()` strategies for mobile devices. On mobile, the complex timeline will be simplified to a sequential fade-in to maintain performance and usability.
- **Terminal Effect:** Confirm the `TextPlugin` types correctly and the cursor flashes as intended.
- **Cleanup:** Ensure the `master` timeline and all GSAP contexts are reverted on unmount.