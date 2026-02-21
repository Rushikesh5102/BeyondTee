const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Force IPv4 resolution to bypass local network ISP routing/timeout issues
dns.setDefaultResultOrder('ipv4first');

cloudinary.config({
    cloud_name: 'dlzb880bl',
    api_key: '666479954674914',
    api_secret: 'Mkeoolweqf9y0iyThFmgY-w8JTQ'
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function uploadFile(filePath, folder, resourceType = 'image', retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[Attempt ${attempt}/${retries}] Uploading ${path.basename(filePath)}...`);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: `beyondtee/${folder}`,
                use_filename: true,
                unique_filename: false,
                resource_type: resourceType,
                timeout: 120000 // 2 minutes timeout
            });
            console.log(`✅ Success: ${result.secure_url}`);
            return result.secure_url;
        } catch (error) {
            console.error(`❌ Error uploading ${path.basename(filePath)} on attempt ${attempt}:`, error.message || error);
            if (attempt === retries) {
                console.error(`Failed to upload ${path.basename(filePath)} after ${retries} attempts.`);
                return null;
            }
            console.log(`Waiting 5 seconds before retrying...`);
            await sleep(5000);
        }
    }
}

async function run() {
    const publicDir = path.join(__dirname, '../../web/public');
    const productsDir = path.join(publicDir, 'products');

    // 1. Upload 3D Models (.glb)
    const glbFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.glb'));
    for (const file of glbFiles) {
        await uploadFile(path.join(publicDir, file), 'models', 'raw');
    }

    // 2. Upload Product Images (.png, .jpg)
    if (fs.existsSync(productsDir)) {
        const productImages = fs.readdirSync(productsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
        for (const file of productImages) {
            await uploadFile(path.join(productsDir, file), 'products', 'image');
        }
    }
}

run();
