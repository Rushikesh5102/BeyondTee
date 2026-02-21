const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dlzb880bl',
    api_key: '666479954674914',
    api_secret: 'Mkeoolweqf9y0iyThFmgY-w8JTQ',
    upload_prefix: 'https://api.cloudinary.com' // Force HTTPS endpoint bypass
});

console.log('--- Step 3: Testing SDK Small Upload ---');

async function testUpload() {
    try {
        const result = await cloudinary.uploader.upload('https://cloudinary-res.cloudinary.com/image/upload/cloudinary_logo.png', {
            folder: 'beyondtee/test'
        });
        console.log('✅ SDK Upload Success:', result.secure_url);
    } catch (err) {
        console.error('❌ SDK Upload Failed:', err);
    }
}

testUpload();
