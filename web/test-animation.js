const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log("Navigating to login...");
    await page.goto('http://localhost:3000/auth/signin');

    console.log("Filling credentials...");
    await page.fill('input[type="text"]', 'Pattiwarrushikesh5102@gmail.com');
    await page.fill('input[type="password"]', 'Rushikesh@5102');

    console.log("Submitting...");
    await page.click('button[type="submit"]');

    console.log("Waiting for navigation to admin...");
    try {
        await page.waitForTimeout(500); // Give it a sec

        // Wait for the animation text to appear
        console.log("Waiting for welcome text...");
        await page.waitForSelector('text=Welcome Back', { timeout: 5000 });
        console.log("SUCCESS: Welcome animation found!");

        // Take a screenshot of the animation
        await page.screenshot({ path: 'owner_welcome.png' });
        console.log("Saved screenshot to owner_welcome.png");

    } catch (e) {
        console.error("FAILED to find animation:", e.message);
        await page.screenshot({ path: 'owner_welcome_error.png' });
    }

    await browser.close();
})();
