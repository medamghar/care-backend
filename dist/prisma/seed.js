"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const promotions_seed_1 = require("./promotions-seed");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    console.log('Creating roles...');
    const superAdminRole = await prisma.role.upsert({
        where: { name: 'super_admin' },
        update: {},
        create: {
            name: 'super_admin',
            permissions: {
                users: ['create', 'read', 'update', 'delete'],
                shops: ['create', 'read', 'update', 'delete', 'approve'],
                products: ['create', 'read', 'update', 'delete'],
                orders: ['create', 'read', 'update', 'delete'],
                promotions: ['create', 'read', 'update', 'delete'],
                notifications: ['create', 'read', 'update', 'delete'],
            },
        },
    });
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            name: 'admin',
            permissions: {
                shops: ['read', 'update', 'approve'],
                products: ['create', 'read', 'update', 'delete'],
                orders: ['read', 'update'],
                promotions: ['create', 'read', 'update', 'delete'],
                notifications: ['create', 'read', 'update'],
            },
        },
    });
    const commercialRole = await prisma.role.upsert({
        where: { name: 'commercial' },
        update: {},
        create: {
            name: 'commercial',
            permissions: {
                shops: ['create', 'read'],
                products: ['read'],
                orders: ['read'],
            },
        },
    });
    const warehouseRole = await prisma.role.upsert({
        where: { name: 'warehouse' },
        update: {},
        create: {
            name: 'warehouse',
            permissions: {
                orders: ['read', 'update'],
                products: ['read', 'update'],
            },
        },
    });
    console.log('Creating default admin user...');
    const hashedPassword = await bcrypt.hash('0612345678', 12);
    const adminUser = await prisma.user.upsert({
        where: { phone: '0612345678' },
        update: {},
        create: {
            phone: '0612345678',
            passwordHash: hashedPassword,
            roleId: superAdminRole.id,
            isActive: true,
        },
    });
    console.log('Creating sample commercial agent...');
    const commercialUser = await prisma.user.upsert({
        where: { phone: '0612345679' },
        update: {},
        create: {
            phone: '0612345679',
            passwordHash: await bcrypt.hash('0612345679', 12),
            roleId: commercialRole.id,
            isActive: true,
        },
    });
    await prisma.commercialAgent.upsert({
        where: { userId: commercialUser.id },
        update: {},
        create: {
            userId: commercialUser.id,
            territory: 'Casablanca-Settat',
            commissionRate: 0.05,
        },
    });
    console.log('Creating sample brands...');
    const brands = [
        { name: 'L\'Oréal', logoUrl: 'https://img.logo.dev/loreal.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Nivea', logoUrl: 'https://img.logo.dev/nivea.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Garnier', logoUrl: 'https://img.logo.dev/garnier.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Pantene', logoUrl: 'https://img.logo.dev/pantene.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Head & Shoulders', logoUrl: 'https://via.placeholder.com/120x60/1E3A8A/FFFFFF?text=H%26S' },
        { name: 'Dove', logoUrl: 'https://img.logo.dev/dove.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Maybelline', logoUrl: 'https://img.logo.dev/maybelline.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Revlon', logoUrl: 'https://img.logo.dev/revlon.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Olay', logoUrl: 'https://img.logo.dev/olay.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Eucerin', logoUrl: 'https://img.logo.dev/eucerin.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Vichy', logoUrl: 'https://img.logo.dev/vichy.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'La Roche-Posay', logoUrl: 'https://img.logo.dev/laroche-posay.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Avène', logoUrl: 'https://img.logo.dev/avene.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'CeraVe', logoUrl: 'https://img.logo.dev/cerave.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Neutrogena', logoUrl: 'https://img.logo.dev/neutrogena.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Bioderma', logoUrl: 'https://img.logo.dev/bioderma.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Sebamed', logoUrl: 'https://via.placeholder.com/120x60/00A651/FFFFFF?text=Sebamed' },
        { name: 'Mustela', logoUrl: 'https://img.logo.dev/mustela.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Calvin Klein', logoUrl: 'https://img.logo.dev/calvinklein.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Hugo Boss', logoUrl: 'https://img.logo.dev/hugoboss.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Versace', logoUrl: 'https://img.logo.dev/versace.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Giorgio Armani', logoUrl: 'https://img.logo.dev/armani.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Chanel', logoUrl: 'https://img.logo.dev/chanel.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
        { name: 'Dior', logoUrl: 'https://img.logo.dev/dior.com?token=pk_X-1ZO13ESEOxkEZpzVzrIA' },
    ];
    const createdBrands = [];
    for (const brand of brands) {
        const createdBrand = await prisma.brand.upsert({
            where: { name: brand.name },
            update: {},
            create: brand,
        });
        createdBrands.push(createdBrand);
    }
    console.log('Creating sample categories...');
    const categories = [
        {
            nameAr: 'منتجات العناية بالشعر',
            nameFr: 'Soins Capillaires',
            imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop&crop=center',
            sortOrder: 1,
        },
        {
            nameAr: 'منتجات العناية بالبشرة',
            nameFr: 'Soins de la Peau',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&crop=center',
            sortOrder: 2,
        },
        {
            nameAr: 'منتجات النظافة الشخصية',
            nameFr: 'Hygiène Personnelle',
            imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&crop=center',
            sortOrder: 3,
        },
        {
            nameAr: 'العطور ومزيلات العرق',
            nameFr: 'Parfums et Déodorants',
            imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
            sortOrder: 4,
        },
        {
            nameAr: 'مستحضرات التجميل',
            nameFr: 'Maquillage',
            imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
            sortOrder: 5,
        },
        {
            nameAr: 'منتجات الأطفال',
            nameFr: 'Produits Bébé',
            imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400&h=400&fit=crop&crop=center',
            sortOrder: 6,
        },
        {
            nameAr: 'المكملات الغذائية',
            nameFr: 'Compléments Alimentaires',
            imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
            sortOrder: 7,
        },
        {
            nameAr: 'الأدوية والصحة',
            nameFr: 'Médicaments et Santé',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center',
            sortOrder: 8,
        },
    ];
    const createdCategories = [];
    for (const category of categories) {
        const existingCategory = await prisma.category.findFirst({
            where: { nameAr: category.nameAr },
        });
        if (existingCategory) {
            createdCategories.push(existingCategory);
        }
        else {
            const createdCategory = await prisma.category.create({
                data: category,
            });
            createdCategories.push(createdCategory);
        }
    }
    console.log('Creating subcategories...');
    const subcategories = [
        {
            nameAr: 'شامبو',
            nameFr: 'Shampooing',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[0].id,
            sortOrder: 1,
        },
        {
            nameAr: 'بلسم',
            nameFr: 'Après-shampooing',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[0].id,
            sortOrder: 2,
        },
        {
            nameAr: 'زيوت الشعر',
            nameFr: 'Huiles Capillaires',
            imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[0].id,
            sortOrder: 3,
        },
        {
            nameAr: 'كريمات مرطبة',
            nameFr: 'Crèmes Hydratantes',
            imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[1].id,
            sortOrder: 1,
        },
        {
            nameAr: 'منظفات الوجه',
            nameFr: 'Nettoyants Visage',
            imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[1].id,
            sortOrder: 2,
        },
        {
            nameAr: 'واقي الشمس',
            nameFr: 'Protection Solaire',
            imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[1].id,
            sortOrder: 3,
        },
        {
            nameAr: 'أساس المكياج',
            nameFr: 'Fond de Teint',
            imageUrl: 'https://images.unsplash.com/photo-1631214540914-c64c6359e4c4?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[4].id,
            sortOrder: 1,
        },
        {
            nameAr: 'أحمر الشفاه',
            nameFr: 'Rouge à Lèvres',
            imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop&crop=center',
            parentId: createdCategories[4].id,
            sortOrder: 2,
        },
    ];
    for (const subcategory of subcategories) {
        const existingSubcategory = await prisma.category.findFirst({
            where: { nameAr: subcategory.nameAr },
        });
        if (!existingSubcategory) {
            await prisma.category.create({
                data: subcategory,
            });
        }
    }
    console.log('Creating sample products...');
    const products = [
        {
            sku: 'SH001',
            nameAr: 'شامبو لوريال للشعر الجاف',
            nameFr: 'L\'Oréal Shampooing Cheveux Secs',
            descriptionAr: 'شامبو مخصص للشعر الجاف والتالف، يوفر ترطيباً عميقاً ونعومة فائقة',
            descriptionFr: 'Shampooing spécialement formulé pour cheveux secs et abîmés',
            categoryId: createdCategories[0].id,
            brandId: createdBrands.find(b => b.name === 'L\'Oréal')?.id || createdBrands[0].id,
            basePrice: 45.00,
            currentStock: 150,
            isFeatured: true,
        },
        {
            sku: 'SH002',
            nameAr: 'شامبو بانتين للشعر المتضرر',
            nameFr: 'Pantene Shampooing Réparation',
            descriptionAr: 'شامبو مقوي ومرمم للشعر المتضرر من الصبغات والحرارة',
            descriptionFr: 'Shampooing réparateur pour cheveux abîmés',
            categoryId: createdCategories[0].id,
            brandId: createdBrands.find(b => b.name === 'Pantene')?.id || createdBrands[3].id,
            basePrice: 38.00,
            currentStock: 120,
            isFeatured: false,
        },
        {
            sku: 'SH003',
            nameAr: 'شامبو هيد آند شولدرز ضد القشرة',
            nameFr: 'Head & Shoulders Anti-Pelliculaire',
            descriptionAr: 'شامبو فعال ضد القشرة مع حماية تدوم 72 ساعة',
            descriptionFr: 'Shampooing anti-pelliculaire efficace, protection 72h',
            categoryId: createdCategories[0].id,
            brandId: createdBrands.find(b => b.name === 'Head & Shoulders')?.id || createdBrands[4].id,
            basePrice: 42.00,
            currentStock: 95,
            isFeatured: true,
        },
        {
            sku: 'SH004',
            nameAr: 'شامبو دوف للشعر العادي',
            nameFr: 'Dove Shampooing Cheveux Normaux',
            descriptionAr: 'شامبو مغذي للشعر العادي بتركيبة خالية من الكبريتات',
            descriptionFr: 'Shampooing nourrissant pour cheveux normaux, sans sulfates',
            categoryId: createdCategories[0].id,
            brandId: createdBrands.find(b => b.name === 'Dove')?.id || createdBrands[5].id,
            basePrice: 35.00,
            currentStock: 180,
            isFeatured: false,
        },
        {
            sku: 'CR001',
            nameAr: 'كريم نيفيا المرطب',
            nameFr: 'Nivea Crème Hydratante',
            descriptionAr: 'كريم مرطب للوجه والجسم، يوفر ترطيباً يدوم 24 ساعة',
            descriptionFr: 'Crème hydratante visage et corps, hydratation 24h',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Nivea')?.id || createdBrands[1].id,
            basePrice: 35.00,
            currentStock: 200,
            isFeatured: true,
        },
        {
            sku: 'CR002',
            nameAr: 'كريم فيشي للوجه الحساس',
            nameFr: 'Vichy Crème Visage Sensible',
            descriptionAr: 'كريم مهدئ للبشرة الحساسة بالمياه الحرارية',
            descriptionFr: 'Crème apaisante peaux sensibles aux eaux thermales',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Vichy')?.id || createdBrands[10].id,
            basePrice: 85.00,
            currentStock: 75,
            isFeatured: true,
        },
        {
            sku: 'CR003',
            nameAr: 'كريم لاروش بوزيه للبشرة الجافة',
            nameFr: 'La Roche-Posay Lipikar Baume',
            descriptionAr: 'بلسم مرطب للبشرة الجافة جداً والمتهيجة',
            descriptionFr: 'Baume hydratant pour peaux très sèches et irritées',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'La Roche-Posay')?.id || createdBrands[11].id,
            basePrice: 95.00,
            currentStock: 60,
            isFeatured: false,
        },
        {
            sku: 'CR004',
            nameAr: 'منظف سيرافي للوجه',
            nameFr: 'CeraVe Nettoyant Visage',
            descriptionAr: 'منظف لطيف للوجه مع السيراميد وحمض الهيالورونيك',
            descriptionFr: 'Nettoyant doux enrichi en céramides et acide hyaluronique',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'CeraVe')?.id || createdBrands[13].id,
            basePrice: 75.00,
            currentStock: 120,
            isFeatured: false,
        },
        {
            sku: 'GD001',
            nameAr: 'جل استحمام غارنييه',
            nameFr: 'Garnier Gel Douche',
            descriptionAr: 'جل استحمام منعش برائحة الفواكه الطبيعية',
            descriptionFr: 'Gel douche rafraîchissant aux extraits de fruits',
            categoryId: createdCategories[2].id,
            brandId: createdBrands.find(b => b.name === 'Garnier')?.id || createdBrands[2].id,
            basePrice: 25.00,
            currentStock: 300,
            isFeatured: false,
        },
        {
            sku: 'GD002',
            nameAr: 'جل استحمام دوف المرطب',
            nameFr: 'Dove Gel Douche Hydratant',
            descriptionAr: 'جل استحمام مرطب بكريم الترطيب العميق',
            descriptionFr: 'Gel douche hydratant à la crème nutritive',
            categoryId: createdCategories[2].id,
            brandId: createdBrands.find(b => b.name === 'Dove')?.id || createdBrands[5].id,
            basePrice: 28.00,
            currentStock: 250,
            isFeatured: false,
        },
        {
            sku: 'PF001',
            nameAr: 'عطر كالفن كلاين إيترنتي',
            nameFr: 'Calvin Klein Eternity',
            descriptionAr: 'عطر كلاسيكي أنيق برائحة زهرية خشبية',
            descriptionFr: 'Parfum classique élégant aux notes florales boisées',
            categoryId: createdCategories[3].id,
            brandId: createdBrands.find(b => b.name === 'Calvin Klein')?.id || createdBrands[18].id,
            basePrice: 320.00,
            currentStock: 45,
            isFeatured: true,
        },
        {
            sku: 'PF002',
            nameAr: 'عطر هوغو بوس بوتليد',
            nameFr: 'Hugo Boss Bottled',
            descriptionAr: 'عطر رجالي قوي برائحة خشبية مسكية',
            descriptionFr: 'Parfum masculin intense aux notes boisées musquées',
            categoryId: createdCategories[3].id,
            brandId: createdBrands.find(b => b.name === 'Hugo Boss')?.id || createdBrands[19].id,
            basePrice: 380.00,
            currentStock: 35,
            isFeatured: true,
        },
        {
            sku: 'MK001',
            nameAr: 'كريم أساس مايبيلين',
            nameFr: 'Maybelline Fond de Teint',
            descriptionAr: 'كريم أساس طويل الأمد بتغطية كاملة',
            descriptionFr: 'Fond de teint longue tenue, couvrance totale',
            categoryId: createdCategories[4].id,
            brandId: createdBrands.find(b => b.name === 'Maybelline')?.id || createdBrands[6].id,
            basePrice: 65.00,
            currentStock: 85,
            isFeatured: false,
        },
        {
            sku: 'MK002',
            nameAr: 'أحمر شفاه ريفلون',
            nameFr: 'Revlon Rouge à Lèvres',
            descriptionAr: 'أحمر شفاه كريمي بألوان زاهية تدوم طويلاً',
            descriptionFr: 'Rouge à lèvres crémeux, couleurs vives longue tenue',
            categoryId: createdCategories[4].id,
            brandId: createdBrands.find(b => b.name === 'Revlon')?.id || createdBrands[7].id,
            basePrice: 45.00,
            currentStock: 120,
            isFeatured: false,
        },
        {
            sku: 'BB001',
            nameAr: 'لوشن موستيلا للأطفال',
            nameFr: 'Mustela Lait Hydratant Bébé',
            descriptionAr: 'لوشن مرطب لطيف للبشرة الحساسة للأطفال',
            descriptionFr: 'Lait hydratant doux pour peau délicate de bébé',
            categoryId: createdCategories[5].id,
            brandId: createdBrands.find(b => b.name === 'Mustela')?.id || createdBrands[17].id,
            basePrice: 68.00,
            currentStock: 90,
            isFeatured: false,
        },
        {
            sku: 'BB002',
            nameAr: 'شامبو الأطفال اللطيف',
            nameFr: 'Shampooing Bébé Doux',
            descriptionAr: 'شامبو خالي من الدموع مخصص للأطفال الرضع',
            descriptionFr: 'Shampooing sans larmes spécial nourrissons',
            categoryId: createdCategories[5].id,
            brandId: createdBrands.find(b => b.name === 'Mustela')?.id || createdBrands[17].id,
            basePrice: 55.00,
            currentStock: 110,
            isFeatured: false,
        },
        {
            sku: 'LX001',
            nameAr: 'عطر شانيل نمبر 5',
            nameFr: 'Chanel N°5 Eau de Parfum',
            descriptionAr: 'العطر الأسطوري الكلاسيكي من شانيل',
            descriptionFr: 'Le parfum mythique et intemporel de Chanel',
            categoryId: createdCategories[3].id,
            brandId: createdBrands.find(b => b.name === 'Chanel')?.id || createdBrands[22].id,
            basePrice: 850.00,
            currentStock: 25,
            isFeatured: true,
        },
        {
            sku: 'LX002',
            nameAr: 'عطر ديور سوفاج',
            nameFr: 'Dior Sauvage Eau de Toilette',
            descriptionAr: 'عطر رجالي حديث برائحة منعشة وجريئة',
            descriptionFr: 'Parfum masculin moderne aux notes fraîches et audacieuses',
            categoryId: createdCategories[3].id,
            brandId: createdBrands.find(b => b.name === 'Dior')?.id || createdBrands[23].id,
            basePrice: 650.00,
            currentStock: 30,
            isFeatured: true,
        },
        {
            sku: 'SC001',
            nameAr: 'واقي الشمس أفين 50+',
            nameFr: 'Avène Fluide Minéral Teinté SPF50+',
            descriptionAr: 'واقي شمس معدني ملون للوجه الحساس',
            descriptionFr: 'Protection solaire minérale teintée visage sensible',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Avène')?.id || createdBrands[12].id,
            basePrice: 125.00,
            currentStock: 80,
            isFeatured: false,
        },
        {
            sku: 'SC002',
            nameAr: 'واقي الشمس نيوتروجينا',
            nameFr: 'Neutrogena Ultra Sheer SPF30',
            descriptionAr: 'واقي شمس خفيف وغير دهني للاستخدام اليومي',
            descriptionFr: 'Protection solaire légère non grasse usage quotidien',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Neutrogena')?.id || createdBrands[14].id,
            basePrice: 85.00,
            currentStock: 95,
            isFeatured: false,
        },
        {
            sku: 'AA001',
            nameAr: 'كريم أولاي المضاد للشيخوخة',
            nameFr: 'Olay Regenerist Micro-Sculpting',
            descriptionAr: 'كريم مضاد للشيخوخة بالببتيدات والنياسيناميد',
            descriptionFr: 'Crème anti-âge aux peptides et niacinamide',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Olay')?.id || createdBrands[8].id,
            basePrice: 180.00,
            currentStock: 65,
            isFeatured: true,
        },
        {
            sku: 'AA002',
            nameAr: 'سيروم يوسيرين المضاد للتصبغ',
            nameFr: 'Eucerin Anti-Pigment Sérum',
            descriptionAr: 'سيروم مركز لتقليل البقع الداكنة والتصبغات',
            descriptionFr: 'Sérum concentré réducteur de taches pigmentaires',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Eucerin')?.id || createdBrands[9].id,
            basePrice: 220.00,
            currentStock: 45,
            isFeatured: true,
        },
        {
            sku: 'MC001',
            nameAr: 'مزيل عرق نيفيا للرجال',
            nameFr: 'Nivea Men Déodorant 48h',
            descriptionAr: 'مزيل عرق للرجال بحماية تدوم 48 ساعة',
            descriptionFr: 'Déodorant homme protection longue durée 48h',
            categoryId: createdCategories[3].id,
            brandId: createdBrands.find(b => b.name === 'Nivea')?.id || createdBrands[1].id,
            basePrice: 32.00,
            currentStock: 180,
            isFeatured: false,
        },
        {
            sku: 'MC002',
            nameAr: 'جل الحلاقة للرجال',
            nameFr: 'Gel de Rasage Homme',
            descriptionAr: 'جل حلاقة مرطب للبشرة الحساسة',
            descriptionFr: 'Gel de rasage hydratant peaux sensibles',
            categoryId: createdCategories[2].id,
            brandId: createdBrands.find(b => b.name === 'Nivea')?.id || createdBrands[1].id,
            basePrice: 42.00,
            currentStock: 110,
            isFeatured: false,
        },
        {
            sku: 'SP001',
            nameAr: 'غسول بيوديرما للبشرة الدهنية',
            nameFr: 'Bioderma Sébium Gel Moussant',
            descriptionAr: 'غسول منقي للبشرة المختلطة والدهنية',
            descriptionFr: 'Gel nettoyant purifiant peaux mixtes à grasses',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Bioderma')?.id || createdBrands[15].id,
            basePrice: 95.00,
            currentStock: 70,
            isFeatured: false,
        },
        {
            sku: 'SP002',
            nameAr: 'صابون سيباميد الطبي',
            nameFr: 'Sebamed Pain Dermatologique',
            descriptionAr: 'صابون طبي بدرجة حموضة 5.5 للبشرة الحساسة',
            descriptionFr: 'Pain dermatologique pH 5.5 peaux sensibles',
            categoryId: createdCategories[1].id,
            brandId: createdBrands.find(b => b.name === 'Sebamed')?.id || createdBrands[16].id,
            basePrice: 55.00,
            currentStock: 130,
            isFeatured: false,
        },
        {
            sku: 'HS001',
            nameAr: 'جل تصفيف الشعر لوريال',
            nameFr: 'L\'Oréal Gel Coiffant Extra Fort',
            descriptionAr: 'جل تصفيف قوي للشعر بثبات يدوم طويلاً',
            descriptionFr: 'Gel coiffant fixation extra forte longue durée',
            categoryId: createdCategories[0].id,
            brandId: createdBrands.find(b => b.name === 'L\'Oréal')?.id || createdBrands[0].id,
            basePrice: 35.00,
            currentStock: 90,
            isFeatured: false,
        },
        {
            sku: 'HS002',
            nameAr: 'سبراي حماية الشعر من الحرارة',
            nameFr: 'Spray Thermo-Protecteur',
            descriptionAr: 'سبراي حماية الشعر من أضرار الحرارة والتصفيف',
            descriptionFr: 'Spray protection thermique coiffage',
            categoryId: createdCategories[0].id,
            brandId: createdBrands.find(b => b.name === 'Pantene')?.id || createdBrands[3].id,
            basePrice: 48.00,
            currentStock: 75,
            isFeatured: false,
        },
        {
            sku: 'OC001',
            nameAr: 'معجون أسنان متقدم',
            nameFr: 'Dentifrice Protection Complète',
            descriptionAr: 'معجون أسنان بالفلورايد لحماية شاملة',
            descriptionFr: 'Dentifrice au fluorure protection complète',
            categoryId: createdCategories[2].id,
            brandId: createdBrands.find(b => b.name === 'Nivea')?.id || createdBrands[1].id,
            basePrice: 28.00,
            currentStock: 200,
            isFeatured: false,
        },
        {
            sku: 'OC002',
            nameAr: 'غسول الفم المنعش',
            nameFr: 'Bain de Bouche Rafraîchissant',
            descriptionAr: 'غسول فم مضاد للبكتيريا برائحة النعناع',
            descriptionFr: 'Bain de bouche antibactérien menthe fraîche',
            categoryId: createdCategories[2].id,
            brandId: createdBrands.find(b => b.name === 'Nivea')?.id || createdBrands[1].id,
            basePrice: 35.00,
            currentStock: 150,
            isFeatured: false,
        },
    ];
    for (const product of products) {
        const createdProduct = await prisma.product.upsert({
            where: { sku: product.sku },
            update: {},
            create: product,
        });
        await prisma.productImage.upsert({
            where: { id: `${createdProduct.id}-primary` },
            update: {},
            create: {
                id: `${createdProduct.id}-primary`,
                productId: createdProduct.id,
                imageUrl: `https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=${encodeURIComponent(product.nameAr)}`,
                sortOrder: 1,
                isPrimary: true,
            },
        });
        const priceTiers = [
            { minQuantity: 10, pricePerUnit: product.basePrice * 0.95 },
            { minQuantity: 50, pricePerUnit: product.basePrice * 0.90 },
            { minQuantity: 100, pricePerUnit: product.basePrice * 0.85 },
        ];
        for (const tier of priceTiers) {
            await prisma.priceTier.create({
                data: {
                    productId: createdProduct.id,
                    minQuantity: tier.minQuantity,
                    pricePerUnit: tier.pricePerUnit,
                },
            });
        }
    }
    console.log('Creating sample shop...');
    const sampleShop = await prisma.shop.upsert({
        where: { phone: '0661234567' },
        update: {},
        create: {
            nameAr: 'صيدلية النور',
            nameFr: 'Pharmacie Al-Nour',
            ownerName: 'أحمد بن علي',
            phone: '0661234567',
            passwordHash: await bcrypt.hash('0661234567', 12),
            city: 'Casablanca',
            address: 'شارع محمد الخامس، الدار البيضاء',
            latitude: 33.5731,
            longitude: -7.5898,
            status: 'APPROVED',
            createdByUserId: commercialUser.id,
            approvedByUserId: adminUser.id,
        },
    });
    await prisma.shopImage.createMany({
        data: [
            {
                shopId: sampleShop.id,
                imageUrl: 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=صيدلية+النور',
                sortOrder: 1,
            },
            {
                shopId: sampleShop.id,
                imageUrl: 'https://via.placeholder.com/400x300/52C41A/FFFFFF?text=داخل+الصيدلية',
                sortOrder: 2,
            },
        ],
        skipDuplicates: true,
    });
    await (0, promotions_seed_1.seedPromotions)();
    console.log('Creating promotional sliders...');
    const sliders = [
        {
            imageUrl: 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=عرض+خاص+على+منتجات+العناية',
            linkUrl: '/products?featured=true',
            sortOrder: 1,
        },
        {
            imageUrl: 'https://via.placeholder.com/800x400/52C41A/FFFFFF?text=منتجات+جديدة+وصلت',
            linkUrl: '/products?new=true',
            sortOrder: 2,
        },
        {
            imageUrl: 'https://via.placeholder.com/800x400/FA8C16/FFFFFF?text=توصيل+مجاني+للطلبات+الكبيرة',
            linkUrl: '/products',
            sortOrder: 3,
        },
    ];
    for (const slider of sliders) {
        const existingSlider = await prisma.slider.findFirst({
            where: { imageUrl: slider.imageUrl },
        });
        if (!existingSlider) {
            await prisma.slider.create({
                data: slider,
            });
        }
    }
    console.log('Creating sample order...');
    const orderNumber = `ORD-${Date.now()}-0001`;
    const sampleOrder = await prisma.order.create({
        data: {
            shopId: sampleShop.id,
            orderNumber,
            status: 'CONFIRMED',
            subtotal: 160.00,
            discountAmount: 0,
            taxAmount: 32.00,
            totalAmount: 192.00,
            notes: 'طلب تجريبي للاختبار',
            items: {
                create: [
                    {
                        productId: (await prisma.product.findFirst({ where: { sku: 'SH001' } })).id,
                        quantity: 2,
                        unitPrice: 45.00,
                        totalPrice: 90.00,
                    },
                    {
                        productId: (await prisma.product.findFirst({ where: { sku: 'CR001' } })).id,
                        quantity: 2,
                        unitPrice: 35.00,
                        totalPrice: 70.00,
                    },
                ],
            },
        },
    });
    console.log('Creating sample notifications...');
    await prisma.notification.createMany({
        data: [
            {
                shopId: sampleShop.id,
                title: 'مرحباً بك في نظام Care',
                message: 'تم تفعيل حسابك بنجاح. يمكنك الآن استخدام النظام.',
                imageUrl: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=مرحبا',
                route: '/dashboard',
            },
            {
                shopId: sampleShop.id,
                title: 'تحديث الطلب',
                message: `تم تأكيد طلب جديد رقم ${orderNumber}`,
                imageUrl: 'https://via.placeholder.com/300x200/52C41A/FFFFFF?text=طلب+جديد',
                route: `/orders/${sampleOrder.id}`,
                products: JSON.stringify([
                    { id: 'SH001', name: 'شامبو لوريال للشعر الجاف', quantity: 2 },
                    { id: 'CR001', name: 'كريم نيفيا المرطب', quantity: 2 },
                ]),
            },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Created:');
    console.log(`   - ${await prisma.role.count()} roles`);
    console.log(`   - ${await prisma.user.count()} users`);
    console.log(`   - ${await prisma.brand.count()} brands`);
    console.log(`   - ${await prisma.category.count()} categories`);
    console.log(`   - ${await prisma.product.count()} products`);
    console.log(`   - ${await prisma.shop.count()} shops`);
    console.log(`   - ${await prisma.order.count()} orders`);
    console.log(`   - ${await prisma.promotion.count()} promotions`);
    console.log(`   - ${await prisma.slider.count()} sliders`);
    console.log(`   - ${await prisma.notification.count()} notifications`);
    console.log('');
    console.log('🔑 Default Admin Login:');
    console.log('   Phone: 0612345678');
    console.log('   Password: 0612345678');
    console.log('');
    console.log('🏪 Sample Shop Login:');
    console.log('   Phone: 0661234567');
    console.log('   Password: 0661234567');
    console.log('');
    console.log('👨‍💼 Commercial Agent Login:');
    console.log('   Phone: 0612345679');
    console.log('   Password: 0612345679');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map