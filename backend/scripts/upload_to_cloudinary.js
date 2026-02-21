const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: 'dlzb880bl',
    api_key: '666479954674914',
    api_secret: 'Mkeoolweqf9y0iyThFmgY-w8JTQ'
});

async function uploadFile(filePath, folder, resourceType = 'image') {
    try {
        console.log(`Uploading ${filePath}...`);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `beyondtee/${folder}`,
            use_filename: true,
            unique_filename: false,
            resource_type: resourceType
        });
        console.log(`✅ Success: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Error uploading ${filePath}:`, error);
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
