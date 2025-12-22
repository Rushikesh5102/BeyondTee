import * as dotenv from 'dotenv';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

// Explicitly load .env from backend root
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('Seed DB URL:', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
    console.error('CRITICAL: DATABASE_URL is undefined.');
    process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Remove existing products to clean up old catalog
    try {
        await prisma.product.deleteMany({});
        console.log("Cleared existing products.");
    } catch (e) {
        console.log("Error clearing products:", e);
    }


    // 2. Create Initial Products with real 3D models
    const products = [
        {
            name: 'Essential Men\'s Tee',
            description: 'Classic fit, 100% organic cotton. A daily essential.',
            price: 1999,
            sku: 'TEE-M-001',
            stock: 100,
            category: 'T-Shirts',
            gender: 'MEN',
            collection: 'Minimalist',
            fit: 'Normal',
            fabricDetails: '100% Organic Cotton, 220 GSM',
            careInstructions: 'Machine wash cold. Do not tumble dry.',
            images: JSON.stringify(['/products/tee-black.png', '/products/tee-white.png']),
            modelPath: '/Regular tshirt.glb',
            isCustomizable: true,
            isFeatured: true,
        },
        {
            name: 'Oversized Men\'s Tee',
            description: 'Heavyweight cotton, drop-shoulder fit. Premium staple.',
            price: 2499,
            sku: 'TEE-M-OVER-001',
            stock: 100,
            category: 'T-Shirts',
            gender: 'MEN',
            collection: 'Urban',
            fit: 'Oversized',
            fabricDetails: '100% Cotton, 300 GSM Heavyweight',
            careInstructions: 'Wash inside out. Iron low heat.',
            images: JSON.stringify(['/products/tee-black.png']),
            modelPath: '/Oversized tshirt.glb',
            isCustomizable: true,
            isFeatured: true,
        },
        {
            name: 'Essential Women\'s Tee',
            description: 'Soft touch, tailored fit. Perfect for layering.',
            price: 1999,
            sku: 'TEE-W-001',
            stock: 100,
            category: 'T-Shirts',
            gender: 'WOMEN',
            collection: 'Minimalist',
            fit: 'Normal',
            fabricDetails: '95% Cotton, 5% Elastane',
            careInstructions: 'Hand wash recommended.',
            images: JSON.stringify(['/products/tee-white.png']),
            modelPath: '/Female tshirt.glb',
            isCustomizable: true,
        },
        {
            name: 'Oversized Women\'s Tee',
            description: 'Relaxed boyfriend fit. Maximal comfort.',
            price: 2499,
            sku: 'TEE-W-OVER-001',
            stock: 100,
            category: 'T-Shirts',
            gender: 'WOMEN',
            collection: 'Urban',
            fit: 'Oversized',
            fabricDetails: '100% Cotton, 280 GSM',
            careInstructions: 'Machine wash cold.',
            images: JSON.stringify(['/products/tee-black.png']),
            modelPath: '/Oversized tshirt.glb',
            isCustomizable: true,
        },
        {
            name: 'Classic Polo',
            description: 'Pique cotton, ribbed collar. Smart casual redefined.',
            price: 2999,
            sku: 'POLO-001',
            stock: 50,
            category: 'Polos',
            gender: 'UNISEX',
            collection: 'Classic',
            fit: 'Regular',
            fabricDetails: '100% Pique Cotton',
            careInstructions: 'Wash with similar colors.',
            images: JSON.stringify(['/products/tee-black.png']),
            modelPath: '/Polo tshirt.glb',
            isCustomizable: true,
        },
        {
            name: 'Essential Heavy Hoodie',
            description: 'Premium fleece, boxy cut. Built for comfort and style.',
            price: 4999,
            sku: 'HOOD-001',
            stock: 50,
            category: 'Hoodies',
            gender: 'UNISEX',
            collection: 'Urban',
            fit: 'Boxy',
            fabricDetails: '80% Cotton, 20% Polyester Fleece, 350 GSM',
            careInstructions: 'Machine wash cold. Hang dry.',
            images: JSON.stringify(['/products/hoodie-black.png']),
            modelPath: '/Hoodie.glb',
            isCustomizable: true,
            isFeatured: true,
        },
    ];

    try {
        for (const p of products) {
            const product = await prisma.product.upsert({
                where: { sku: p.sku },
                update: {
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    category: p.category,
                    gender: p.gender,
                    collection: p.collection,
                    fit: p.fit,
                    isFeatured: p.isFeatured,
                    fabricDetails: p.fabricDetails,
                    careInstructions: p.careInstructions,
                    images: p.images,
                    modelPath: p.modelPath,
                    isCustomizable: p.isCustomizable
                },
                create: p,
            });
            console.log(`Upserted product: ${product.name}`);
        }

        const adminEmail = 'admin@beyondtee.com';
        const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!existingAdmin) {
            const admin = await prisma.user.create({
                data: {
                    email: adminEmail,
                    name: 'Admin User',
                    password: 'admin',
                    role: 'ADMIN',
                },
            });
            console.log(`Created admin: ${admin.email}`);
        } else {
            console.log(`Admin ${adminEmail} already exists. Skipping.`);
        }

        console.log('Seeding complete.');
    } catch (e) {
        console.error('Error during seeding logic:', e);
        throw e;
    }
}

main()
    .catch((e) => {
        console.error('Main error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
