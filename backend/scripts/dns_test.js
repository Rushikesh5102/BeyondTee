const dns = require('dns');
const https = require('https');

console.log('--- Step 1: Testing DNS Resolution ---');
dns.lookup('api.cloudinary.com', (err, address, family) => {
    if (err) {
        console.error('❌ DNS Lookup Failed:', err.message);
    } else {
        console.log(`✅ DNS Lookup Success. IP: ${address} (IPv${family})`);

        console.log('\n--- Step 2: Testing HTTPS Connection ---');
        const req = https.request('https://api.cloudinary.com/v1_1/ping', (res) => {
            console.log(`✅ HTTPS Status Code: ${res.statusCode}`);
            res.on('data', d => process.stdout.write(d));
        });

        req.on('error', error => {
            console.error('❌ HTTPS Connection Failed:', error.message);
        });

        req.end();
    }
});
