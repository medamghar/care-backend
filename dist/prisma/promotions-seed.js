"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPromotions = seedPromotions;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedPromotions() {
    console.log('🎉 Starting promotions seeding...');
    try {
        const categories = await prisma.category.findMany();
        const products = await prisma.product.findMany();
        if (categories.length === 0 || products.length === 0) {
            throw new Error('Categories and products must be seeded first');
        }
        const promotions = [
            {
                name: 'عرض الصيف الكبير',
                type: 'PERCENTAGE',
                value: 25,
                startDate: new Date(),
                endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                name: 'خصم الجمعة البيضاء',
                type: 'PERCENTAGE',
                value: 40,
                startDate: new Date(2024, 10, 29),
                endDate: new Date(2024, 11, 2),
                isActive: true,
            },
            {
                name: 'خصم ثابت على الطلبات الكبيرة',
                type: 'FIXED',
                value: 50,
                startDate: new Date(),
                endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                name: 'عرض العودة للمدارس',
                type: 'PERCENTAGE',
                value: 15,
                startDate: new Date(2024, 8, 1),
                endDate: new Date(2024, 8, 30),
                isActive: false,
            },
            {
                name: 'عرض الشتاء الدافئ',
                type: 'PERCENTAGE',
                value: 30,
                startDate: new Date(2024, 11, 15),
                endDate: new Date(2025, 1, 15),
                isActive: true,
            },
            {
                name: 'عرض منتجات العناية الجديدة',
                type: 'FIXED',
                value: 25,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                name: 'عرض الأسبوع الذهبي',
                type: 'PERCENTAGE',
                value: 35,
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                name: 'عرض نهاية الموسم',
                type: 'PERCENTAGE',
                value: 50,
                startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        ];
        const createdPromotions = [];
        for (const promotionData of promotions) {
            const existingPromotion = await prisma.promotion.findFirst({
                where: { name: promotionData.name },
            });
            let promotion;
            if (existingPromotion) {
                promotion = await prisma.promotion.update({
                    where: { id: existingPromotion.id },
                    data: promotionData,
                });
                console.log(`📝 Updated promotion: ${promotionData.name}`);
            }
            else {
                promotion = await prisma.promotion.create({
                    data: promotionData,
                });
                console.log(`✨ Created promotion: ${promotionData.name}`);
            }
            createdPromotions.push(promotion);
        }
        console.log('🔗 Linking promotions to products...');
        const summerPromotion = createdPromotions.find(p => p.name === 'عرض الصيف الكبير');
        if (summerPromotion) {
            const featuredProducts = products.filter(p => p.isFeatured);
            for (const product of featuredProducts) {
                await prisma.promotionProduct.upsert({
                    where: {
                        promotionId_productId: {
                            promotionId: summerPromotion.id,
                            productId: product.id,
                        },
                    },
                    update: {},
                    create: {
                        promotionId: summerPromotion.id,
                        productId: product.id,
                    },
                });
            }
            console.log(`   - Applied summer promotion to ${featuredProducts.length} featured products`);
        }
        const blackFridayPromotion = createdPromotions.find(p => p.name === 'خصم الجمعة البيضاء');
        if (blackFridayPromotion) {
            const lorealBrand = await prisma.brand.findFirst({ where: { name: 'L\'Oréal' } });
            if (lorealBrand) {
                const lorealProducts = products.filter(p => p.brandId === lorealBrand.id);
                for (const product of lorealProducts) {
                    await prisma.promotionProduct.upsert({
                        where: {
                            promotionId_productId: {
                                promotionId: blackFridayPromotion.id,
                                productId: product.id,
                            },
                        },
                        update: {},
                        create: {
                            promotionId: blackFridayPromotion.id,
                            productId: product.id,
                        },
                    });
                }
                console.log(`   - Applied Black Friday promotion to ${lorealProducts.length} L'Oréal products`);
            }
        }
        const winterPromotion = createdPromotions.find(p => p.name === 'عرض الشتاء الدافئ');
        if (winterPromotion) {
            const skincareCategory = categories.find(c => c.nameAr === 'منتجات العناية بالبشرة');
            if (skincareCategory) {
                await prisma.promotionCategory.upsert({
                    where: {
                        promotionId_categoryId: {
                            promotionId: winterPromotion.id,
                            categoryId: skincareCategory.id,
                        },
                    },
                    update: {},
                    create: {
                        promotionId: winterPromotion.id,
                        categoryId: skincareCategory.id,
                    },
                });
                console.log('   - Applied winter promotion to skincare category');
            }
        }
        const newProductsPromotion = createdPromotions.find(p => p.name === 'عرض منتجات العناية الجديدة');
        if (newProductsPromotion) {
            const panteneBrand = await prisma.brand.findFirst({ where: { name: 'Pantene' } });
            if (panteneBrand) {
                const panteneProducts = products.filter(p => p.brandId === panteneBrand.id);
                for (const product of panteneProducts) {
                    await prisma.promotionProduct.upsert({
                        where: {
                            promotionId_productId: {
                                promotionId: newProductsPromotion.id,
                                productId: product.id,
                            },
                        },
                        update: {},
                        create: {
                            promotionId: newProductsPromotion.id,
                            productId: product.id,
                        },
                    });
                }
                console.log(`   - Applied new products promotion to ${panteneProducts.length} Pantene products`);
            }
        }
        const goldenWeekPromotion = createdPromotions.find(p => p.name === 'عرض الأسبوع الذهبي');
        if (goldenWeekPromotion) {
            const hygieneCategory = categories.find(c => c.nameAr === 'منتجات النظافة الشخصية');
            if (hygieneCategory) {
                await prisma.promotionCategory.upsert({
                    where: {
                        promotionId_categoryId: {
                            promotionId: goldenWeekPromotion.id,
                            categoryId: hygieneCategory.id,
                        },
                    },
                    update: {},
                    create: {
                        promotionId: goldenWeekPromotion.id,
                        categoryId: hygieneCategory.id,
                    },
                });
                console.log('   - Applied golden week promotion to hygiene category');
            }
        }
        const endSeasonPromotion = createdPromotions.find(p => p.name === 'عرض نهاية الموسم');
        if (endSeasonPromotion) {
            const hairCareCategory = categories.find(c => c.nameAr === 'منتجات العناية بالشعر');
            if (hairCareCategory) {
                await prisma.promotionCategory.upsert({
                    where: {
                        promotionId_categoryId: {
                            promotionId: endSeasonPromotion.id,
                            categoryId: hairCareCategory.id,
                        },
                    },
                    update: {},
                    create: {
                        promotionId: endSeasonPromotion.id,
                        categoryId: hairCareCategory.id,
                    },
                });
                console.log('   - Applied end of season promotion to hair care category');
            }
        }
        const largeOrdersPromotion = createdPromotions.find(p => p.name === 'خصم ثابت على الطلبات الكبيرة');
        if (largeOrdersPromotion) {
            const expensiveProducts = products.filter(p => p.basePrice > 40);
            for (const product of expensiveProducts) {
                await prisma.promotionProduct.upsert({
                    where: {
                        promotionId_productId: {
                            promotionId: largeOrdersPromotion.id,
                            productId: product.id,
                        },
                    },
                    update: {},
                    create: {
                        promotionId: largeOrdersPromotion.id,
                        productId: product.id,
                    },
                });
            }
            console.log(`   - Applied large orders promotion to ${expensiveProducts.length} expensive products`);
        }
        console.log('✅ Promotions seeding completed successfully!');
        console.log('');
        console.log('📊 Promotion Statistics:');
        console.log(`   - Total promotions: ${createdPromotions.length}`);
        console.log(`   - Active promotions: ${createdPromotions.filter(p => p.isActive).length}`);
        console.log(`   - Percentage promotions: ${createdPromotions.filter(p => p.type === 'PERCENTAGE').length}`);
        console.log(`   - Fixed amount promotions: ${createdPromotions.filter(p => p.type === 'FIXED').length}`);
        console.log('');
        console.log('🔥 Currently Active Promotions:');
        const activePromotions = createdPromotions.filter(p => p.isActive);
        for (const promo of activePromotions) {
            const now = new Date();
            const isCurrentlyActive = promo.startDate <= now && promo.endDate >= now;
            const status = isCurrentlyActive ? '🟢 ACTIVE' :
                promo.startDate > now ? '🟡 SCHEDULED' : '🔴 EXPIRED';
            console.log(`   ${status} ${promo.name} - ${promo.value}${promo.type === 'PERCENTAGE' ? '%' : 'MAD'} off`);
            console.log(`     From: ${promo.startDate.toLocaleDateString()}`);
            console.log(`     To: ${promo.endDate.toLocaleDateString()}`);
            console.log('');
        }
    }
    catch (error) {
        console.error('❌ Error seeding promotions:', error);
        throw error;
    }
}
if (require.main === module) {
    seedPromotions()
        .catch((e) => {
        console.error('❌ Fatal error during promotions seeding:', e);
        process.exit(1);
    })
        .finally(async () => {
        await prisma.$disconnect();
    });
}
//# sourceMappingURL=promotions-seed.js.map