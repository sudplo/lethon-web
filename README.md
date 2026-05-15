# Lethon Protocol | Privacy by Architecture

Lethon is a high-performance, decentralized communications protocol designed to eliminate metadata leaks and ensure absolute privacy. Unlike standard encrypted messaging, Lethon focuses on the **architecture of the network** rather than just the encryption of the content.

## Key Features

- **Metadata Protection**: Ephemeral topics and Tor/I2P routing ensure that not even the network knows who is talking to whom.
- **No Central Server**: A 100% decentralized mesh network using GossipSub and Gossip-based synchronization.
- **IP Obfuscation**: Built-in Tor and I2P integration to hide physical locations and IP addresses.
- **Anti-Voice Biometrics**: A real-time DSP pipeline that processes voice audio to be unrecognizable by analysis systems before it ever leaves the device.
- **Offline-First**: Full synchronization on reconnect and support for alternative transports like Bluetooth.

## Tech Stack

- **Frontend**: Next.js 16 (React 19)
- **Animations**: GSAP (GreenSock Animation Platform) for cinematic scroll-driven storytelling.
- **3D Graphics**: React Three Fiber & Three.js for interactive visualizations.
- **Styling**: Vanilla CSS Modules for high performance and zero-dependency styling.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sudplo/lethon-web.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To generate a static export:

```bash
npm run build
```

The output will be located in the `out/` directory.

## Deployment

This project is configured for static export. To deploy to GitHub Pages:

1. Ensure `next.config.js` has the correct `basePath` and `assetPrefix`.
2. Run `npm run build`.
3. Push the contents of the `out/` folder to your deployment branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
