const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function startTunnel() {
  try {
    // Start ngrok tunnel
    const url = await ngrok.connect({
      addr: 3000,
      proto: 'http'
    });
    console.log('Ngrok tunnel started:', url);

    // Update manifest with ngrok URL
    const manifestPath = path.join(__dirname, '../public/tonconnect-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Update all URLs in manifest
    manifest.url = url;
    manifest.iconUrl = `${url}/ton.png`;
    manifest.image_url = `${url}/ton.png`;
    manifest.termsOfUseUrl = `${url}/terms.html`;
    manifest.privacyPolicyUrl = `${url}/privacy.html`;
    manifest.homepage = url;

    // Write updated manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Manifest updated with ngrok URL');

    // Start the React app
    exec('npm start', (error, stdout, stderr) => {
      if (error) {
        console.error('Error starting React app:', error);
        return;
      }
      console.log(stdout);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

startTunnel(); 