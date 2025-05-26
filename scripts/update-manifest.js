const fs = require('fs');
const path = require('path');
require('dotenv').config();

const manifestPath = path.join(__dirname, '../public/tonconnect-manifest.json');

try {
    // Read the manifest file
    let manifest = fs.readFileSync(manifestPath, 'utf8');

    // Replace all environment variable placeholders
    Object.entries(process.env).forEach(([key, value]) => {
        const placeholder = `%${key}%`;
        manifest = manifest.replace(new RegExp(placeholder, 'g'), value);
    });

    // Write the updated manifest
    fs.writeFileSync(manifestPath, manifest);
    console.log('✅ Manifest updated successfully');
} catch (error) {
    console.error('❌ Error updating manifest:', error);
    process.exit(1);
} 