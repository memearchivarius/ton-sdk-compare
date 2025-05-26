# TON SDK Comparison

This project demonstrates a comparison of two SDKs for working with the TON blockchain: `@ton/ton` and `tonweb`. The project showcases how to send simple "Hello, TON!" messages using both SDKs.

> This project was developed in Cursor with assistance from [contract-knowledge](https://github.com/ton-ai-core/contract-knowledge). While desktop Tonkeeper integration presented challenges, the functionality has been [successfully tested](https://testnet.tonviewer.com/0QCOjZg8VxdEcolCiMYBJfztNzwg3yxYyoqAlVjLpJEhzK2G) with the mobile app.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- ngrok (for Tonkeeper testing)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/memearchivarius/ton-sdk-compare.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Configure environment:
   ```bash
   # Create .env file in the project root
   echo "REACT_APP_BASE_URL=http://localhost:3000" > .env
   ```

4. Set up ngrok tunnel:
   ```bash
   # In a new terminal
   ngrok http 3000
   
   # Update .env with your ngrok URL
   REACT_APP_BASE_URL=https://YOUR-NGROK-URL
   ```

## URL Configuration

The application uses a pre-start script to automatically update URLs in the manifest file:
- React environment variables are automatically available in JavaScript/TypeScript files
- The manifest.json requires manual updates as it's a static file
- Our update-manifest.js script handles this by replacing placeholders with values from .env

To manually update the manifest:
```bash
npm run update-manifest
# or
yarn update-manifest
```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

2. Open your ngrok URL in a browser
3. Connect your Tonkeeper wallet (ensure testnet mode is enabled)

## Project Structure

```
src/
├── App.tsx           # Main component with SDK implementations
├── index.tsx         # Entry point with TON Connect setup
public/
└── tonconnect-manifest.json  # Manifest template
scripts/
└── update-manifest.js        # Environment variable updater
```

## Core Dependencies

- `@ton/ton` - Primary TON blockchain SDK
- `tonweb` - Alternative SDK for comparison
- `@tonconnect/ui-react` - React components for TON Connect
- `buffer` - Browser buffer implementation

## Environment Configuration

Key environment variables:
- `REACT_APP_BASE_URL`: Application base URL (localhost or ngrok URL)

Configuration updates:
1. Modify the `.env` file
2. Application start triggers automatic manifest update
3. Or manually update via `npm run update-manifest`

## Troubleshooting Guide

### Transaction Issues
- **Inactive Buttons**
  - Verify testnet mode in Tonkeeper
  - Check wallet connection status

- **Failed Transactions**
  - Confirm testnet balance
  - Verify ngrok URL configuration

### Manifest Problems
- **Loading Issues**
  - Verify ngrok URL accessibility
  - Check manifest URL configuration
  - Run manifest update script

### URL Configuration
- **Update Problems**
  - Verify `.env` file existence and content
  - Run manual manifest update
  - Check console for errors

## License

MIT
