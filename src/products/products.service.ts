import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  CreateBrandInput,
  ProductFilters,
  ProductConnection,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  // Product CRUD Operations
  async createProduct(input: CreateProductInput) {
    // Check if SKU already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: input.sku },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this SKU already exists');
    }

    // Verify category and brand exist
    const [category, brand] = await Promise.all([
      this.prisma.category.findUnique({ where: { id: input.categoryId } }),
      this.prisma.brand.findUnique({ where: { id: input.brandId } }),
    ]);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const product = await this.prisma.product.create({
      data: {
        sku: input.sku,
        nameAr: input.nameAr,
        nameFr: input.nameFr,
        descriptionAr: input.descriptionAr,
        descriptionFr: input.descriptionFr,
        categoryId: input.categoryId,
        brandId: input.brandId,
        basePrice: input.basePrice,
        currentStock: input.currentStock,
        isFeatured: input.isFeatured || false,
      },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        priceTiers: {
          orderBy: { minQuantity: 'asc' },
        },
      },
    });



    return product;
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: input,
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        priceTiers: {
          orderBy: { minQuantity: 'asc' },
        },
      },
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return true;
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        priceTiers: {
          orderBy: { minQuantity: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getProducts(filters: ProductFilters): Promise<ProductConnection> {
    const {
      search,
      categoryId,
      brandId,
      isFeatured,
      inStock,
      page = 1,
      limit = 20,
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameFr: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured;
    }


    if (inStock) {
      where.currentStock = { gt: 0 };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          priceTiers: {
            orderBy: { minQuantity: 'asc' },
            take: 1,
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      hasMore: skip + products.length < total,
    };
  }

  async getFeaturedProducts(limit = 10) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        currentStock: { gt: 0 },
      },
      take: limit,
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        priceTiers: {
          orderBy: { minQuantity: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Category CRUD Operations
  async createCategory(input: CreateCategoryInput) {
    if (input.parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: input.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return this.prisma.category.create({
      data: {
        nameAr: input.nameAr,
        nameFr: input.nameFr,
        imageUrl: input.imageUrl,
        parentId: input.parentId,
        sortOrder: input.sortOrder || 0,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        products: {
          where: { isActive: true },
          take: 10,
          include: {
            brand: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // Brand CRUD Operations
  async createBrand(input: CreateBrandInput) {
    const existingBrand = await this.prisma.brand.findUnique({
      where: { name: input.name },
    });

    if (existingBrand) {
      throw new BadRequestException('Brand with this name already exists');
    }

    return this.prisma.brand.create({
      data: {
        name: input.name,
        logoUrl: input.logoUrl,
      },
    });
  }

  async getBrands() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getBrand(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
          include: {
            category: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  // Product Images
  async addProductImage(
    productId: string,
    imageUrl: string,
    isPrimary = false,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // If this is primary, unset other primary images
    if (isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    // Get the next sort order
    const lastImage = await this.prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'desc' },
    });

    return this.prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        isPrimary,
        sortOrder: (lastImage?.sortOrder || 0) + 1,
      },
    });
  }

  // Price Tiers
  async addPriceTier(
    productId: string,
    minQuantity: number,
    pricePerUnit: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.priceTier.create({
      data: {
        productId,
        minQuantity,
        pricePerUnit,
      },
    });
  }

  // Search functionality
  async searchProducts(query: string, limit = 20) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { nameAr: { contains: query, mode: 'insensitive' } },
          { nameFr: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { descriptionAr: { contains: query, mode: 'insensitive' } },
          { descriptionFr: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // Stock management
  async updateStock(
    productId: string,
    quantity: number,
    operation: 'add' | 'subtract' = 'add',
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newStock =
      operation === 'add'
        ? product.currentStock + quantity
        : product.currentStock - quantity;

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
    });
  }
}
