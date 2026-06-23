/* eslint-disable */

const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, 'logo-original.png');
const outputWhite = path.join(__dirname, 'public', 'logo-white.png');
const outputBlack = path.join(__dirname, 'public', 'logo-black.png');

async function processLogo() {
    console.log('Processing logos...');

    // 1. Create a mask from the input image (Black becomes opaque, White becomes transparent)
    // Assuming input is Black text on White background.
    // We want to remove the white background.

    // Method:
    // - Convert to grayscale.
    // - Threshold: Dark pixels < 200 become the mask.
    // - Invert logic probably needed depending on source.

    // Simpler approach with Sharp:
    // - Extract the alpha channel based on luminance (darker = more opaque?).
    // - Actually, let's just make sure we interpret "White" as transparent.

    try {
        const metadata = await sharp(input).metadata();

        // Create Black Version (Transparent Background)
        // We assume the logo is black on white. 
        // We can use 'bandbool' or similar, but simpler is:
        // .ensureAlpha() -> .threshold() might work if it was grayscale.

        // Let's rely on functional approach:
        // Create a pure black image and a pure white image of same size
        // Use the input image's inverted luminance as the Alpha channel (White background -> Low Alpha -> Transparent)

        // Read input, grayscale, negate (White(255)->0, Black(0)->255). This becomes our Alpha.
        const alphaChannel = await sharp(input)
            .grayscale()
            .negate() // Invert so Black(text) becomes White(high value alpha)
            .toBuffer();

        // Generate White Logo
        await sharp({
            create: {
                width: metadata.width,
                height: metadata.height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 } // Solid White
            }
        })
            .joinChannel(alphaChannel) // Add the alpha channel
            // Wait, joinChannel adds a NEW channel. We want to REPLACE alpha.
            // Sharp doesn't have easy "replace alpha" in one step without composition.
            // Better strategy:
            // Take the alpha channel we made.
            // Composite it against a solid color using 'dest-in' operation? No.

            // Correct Sharp Strategy for "Colorize Mask":
            // 1. Take alpha channel.
            // 2. Create solid color image.
            // 3. Apply alpha.

            // Let's try a different pipeline:
            // Input -> Grayscale -> Negate -> This IS the alpha buffer.

            // White Logo: 
            // Create plain white image with that alpha.
            .ensureAlpha() // Ensure 4 channels
            .composite([{
                input: alphaChannel,
                raw: { width: metadata.width, height: metadata.height, channels: 1 },
                blend: 'dest-in' // Keep the white where alpha is high
            }])
        // Wait, composite 'dest-in' keeps the 'destination' (the solid white) based on 'source' (alpha) opacity.
        // BUT alphaChannel buffer is just 1 channel grayscale.
        // Let's try: load alphaChannel as an image, ensure it is treated as an alpha mask?

        // Final Simple Strategy:
        // 1. Black Logo: Input image -> Trim white background (make transparent).
        // 2. White Logo: Take Black Logo -> Tint/Modulate to White.

        // Attempting to remove background by "linear" transparency (lighter = more transparent)
        // This removes the background.

        const base = sharp(input)
            .grayscale()
            .toColourspace('b-w') // ensure black and white
            .negate({ alpha: false }); // Invert colors: Black text -> White text, White BG -> Black BG.

        // Actually, let's just use the `linear` trick.
        // (val - black) * slope.

        // Let's use the 'negate' + 'joinChannel' approach which is robust for B&W logos.

        // Step A: Make the Alpha Mask (Black on White input -> Inverted -> White on Black -> White is opaque)
        const alpha = await sharp(input)
            .grayscale()
            .negate()
            .toBuffer();

        // Step B: White Logo
        await sharp({
            create: { width: metadata.width, height: metadata.height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
        })
            .joinChannel(await sharp(input).grayscale().negate().toBuffer()) // This appends a channel 5? No, create has 4 (RGBA).
        // If we create with 3 channels (RGB), then join alpha...

        // RETRY: Create 3-channel solid color, then join alpha.
        await sharp({
            create: { width: metadata.width, height: metadata.height, channels: 3, background: { r: 255, g: 255, b: 255 } }
        })
            .joinChannel(alpha)
            .png()
            .toFile(outputWhite);

        console.log('White logo created.');

        // Step C: Black Logo
        await sharp({
            create: { width: metadata.width, height: metadata.height, channels: 3, background: { r: 0, g: 0, b: 0 } }
        })
            .joinChannel(alpha)
            .png()
            .toFile(outputBlack);

        console.log('Black logo created.');

    } catch (err) {
        console.error('Error:', err);
    }
}

processLogo();
