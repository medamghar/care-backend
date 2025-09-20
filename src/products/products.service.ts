import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  CreateBrandInput,
  ProductFilters,
  ProductConnection,
  Product,
} from './dto/product.dto';
import { FileUpload } from 'graphql-upload-ts';
import { ImageService } from 'src/images/images.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly imageService: ImageService,
    private readonly notificationService :NotificationService
  ) { }
private readonly baseUrl = process.env.BASE_URL || 'http://192.168.1.47:3000';

  // Product CRUD Operations
 async createProduct(input: CreateProductInput, images?: Promise<FileUpload[]>): Promise<Product> {
  const { sku, nameAr, nameFr, categoryId, brandId, basePrice, ...productData } = input;

  // Check if SKU already exists
  const existingSku = await this.prisma.product.findUnique({
    where: { sku },
  });

  if (existingSku) {
    throw new ConflictException('SKU already exists');
  }

  // Verify category exists
  const category = await this.prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

  // Verify brand exists
  const brand = await this.prisma.brand.findUnique({
    where: { id: brandId },
  });

  if (!brand) {
    throw new NotFoundException('Brand not found');
  }

  // Create product
  const product = await this.prisma.product.create({
    data: {
      sku,
      nameAr,
      nameFr,
      categoryId,
      brandId,
      basePrice,
      ...productData,
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

  // Handle image uploads if provided
  if (images) {
    try {
      console.log('New images promise received:', images);

      // Resolve the promise to get FileUpload[]
      const resolvedImages = await images;
      console.log('Resolved images:', resolvedImages);

      // Validate resolved images
      if (!Array.isArray(resolvedImages)) {
        throw new BadRequestException('Invalid image data: expected array of files');
      }

      if (resolvedImages.length > 0) {
        // Validate each file upload object
        for (let i = 0; i < resolvedImages.length; i++) {
          const upload = resolvedImages[i];
          if (!upload || typeof upload !== 'object') {
            throw new BadRequestException(`Invalid file upload at index ${i}: expected FileUpload object`);
          }
        }

        // Convert FileUpload[] to Promise<FileUpload>[]
        const filePromises = resolvedImages.map(upload => Promise.resolve(upload));

        // Upload the images
        const uploadedImages = await this.imageService.uploadMultipleImages(filePromises);

        if (uploadedImages && uploadedImages.length > 0) {
          // Create product images
          const newImages = await this.prisma.productImage.createMany({
            data: uploadedImages.map((img, index) => ({
              productId: product.id,
              imageUrl: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
              sortOrder: index,
              isPrimary: index === 0, // First image is primary by default
            })),
          });

          console.log('New product images created:', uploadedImages);

          if (!newImages) {
            throw new NotFoundException('Product images not created');
          }

          // Re-fetch product with images to return complete data
          const productWithImages = await this.prisma.product.findUnique({
            where: { id: product.id },
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

          return productWithImages;
        }
      }
    } catch (error) {
      // Handle different types of errors
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        // Re-throw our custom exceptions
        throw error;
      }

      // Handle promise rejection errors
      if (error.name === 'TypeError' && error.message.includes('Promise')) {
        throw new BadRequestException('Failed to resolve image promise: invalid promise provided');
      }

      // Handle parsing/validation errors
      if (error.name === 'SyntaxError' || error.message.includes('parse')) {
        throw new BadRequestException(`Image data parsing failed: ${error.message}`);
      }

      // Handle network/upload errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new BadRequestException('Image upload service unavailable');
      }

      // Log the original error for debugging
      console.error('Unexpected error in product image processing:', error);

      // If image processing fails, delete the created product to maintain consistency
      await this.prisma.product.delete({
        where: { id: product.id },
      });

      // Generic error fallback
      throw new BadRequestException(`Product creation failed due to image processing error: ${error.message || 'Unknown error'}`);
    }
  }

  return product;
}

  async updateProduct(id: string, input: UpdateProductInput) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
     let currentQuantity 

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if(product.currentStock===0){
      currentQuantity =0
    }
    const updatedProduct = await this.prisma.product.update({
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


    if(updatedProduct.currentStock !=0 && currentQuantity===0 ){
      await this.notificationService.createBroadcastNotification('new products' , 'sdkddsd' , 'hdhdhdhhd','jjdsjsjdjsj')
    }
    return updatedProduct
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

   async createMultipleProducts(input: CreateProductInput[]): Promise<Product[]> {
    // Validate input
    if (!input || input.length === 0) {
      throw new BadRequestException('At least one product is required');
    }

    // Check for duplicate SKUs in the input
    const skus = input.map(product => product.sku);
    const duplicateSkus = skus.filter((sku, index) => skus.indexOf(sku) !== index);
    if (duplicateSkus.length > 0) {
      throw new BadRequestException(`Duplicate SKUs found in input: ${duplicateSkus.join(', ')}`);
    }

    // Check if SKUs already exist in database
    const existingProducts = await this.prisma.product.findMany({
      where: {
        sku: {
          in: skus
        }
      },
      select: {
        sku: true
      }
    });

    if (existingProducts.length > 0) {
      const existingSkus = existingProducts.map(p => p.sku);
      throw new ConflictException(`Products with following SKUs already exist: ${existingSkus.join(', ')}`);
    }

    // Validate that all categories and brands exist
    const categoryIds = [...new Set(input.map(p => p.categoryId))];
    const brandIds = [...new Set(input.map(p => p.brandId))];

    const [existingCategories, existingBrands] = await Promise.all([
      this.prisma.category.findMany({
        where: {
          id: {
            in: categoryIds
          }
        },
        select: {
          id: true
        }
      }),
      this.prisma.brand.findMany({
        where: {
          id: {
            in: brandIds
          }
        },
        select: {
          id: true
        }
      })
    ]);

    const existingCategoryIds = existingCategories.map(c => c.id);
    const existingBrandIds = existingBrands.map(b => b.id);

    const invalidCategories = categoryIds.filter(id => !existingCategoryIds.includes(id));
    const invalidBrands = brandIds.filter(id => !existingBrandIds.includes(id));

    if (invalidCategories.length > 0) {
      throw new BadRequestException(`Invalid category IDs: ${invalidCategories.join(', ')}`);
    }

    if (invalidBrands.length > 0) {
      throw new BadRequestException(`Invalid brand IDs: ${invalidBrands.join(', ')}`);
    }

    // Use transaction to ensure data consistency
    return await this.prisma.$transaction(async (tx) => {
      const createdProducts: Product[] = [];

      for (const productInput of input) {
        // Create the product
        const product = await tx.product.create({
          data: {
            sku: productInput.sku,
            nameAr: productInput.nameAr,
            nameFr: productInput.nameFr,
            descriptionAr: productInput.descriptionAr,
            descriptionFr: productInput.descriptionFr,
            categoryId: productInput.categoryId,
            brandId: productInput.brandId,
            basePrice: productInput.basePrice,
            currentStock: productInput.currentStock,
            isFeatured: productInput.isFeatured ?? false,
            isActive: productInput.isActive ?? true,
          },
          include: {
            category: true,
            brand: true,
            images: {
              orderBy: {
                sortOrder: 'asc'
              }
            },
            priceTiers: {
              orderBy: {
                minQuantity: 'asc'
              }
            }
          }
        });

        // Create product image if imageUrl is provided
        if (productInput.imageUrl) {
          await tx.productImage.create({
            data: {
              productId: product.id,
              imageUrl: productInput.imageUrl,
              sortOrder: 0,
              isPrimary: true
            }
          });
        }

        createdProducts.push(product);
      }

      return createdProducts;
    });
  }

  // Alternative method for better performance with large batches
  async createMultipleProductsBatch(input: CreateProductInput[]): Promise<{ count: number; products: Product[] }> {
    // Validate input
    if (!input || input.length === 0) {
      throw new BadRequestException('At least one product is required');
    }

    // Perform the same validations as above
    const skus = input.map(product => product.sku);
    const duplicateSkus = skus.filter((sku, index) => skus.indexOf(sku) !== index);
    if (duplicateSkus.length > 0) {
      throw new BadRequestException(`Duplicate SKUs found in input: ${duplicateSkus.join(', ')}`);
    }

    const existingProducts = await this.prisma.product.findMany({
      where: { sku: { in: skus } },
      select: { sku: true }
    });

    if (existingProducts.length > 0) {
      const existingSkus = existingProducts.map(p => p.sku);
      throw new ConflictException(`Products with following SKUs already exist: ${existingSkus.join(', ')}`);
    }

    return await this.prisma.$transaction(async (tx) => {
      // Bulk create products
      const productData = input.map(product => ({
        sku: product.sku,
        nameAr: product.nameAr,
        nameFr: product.nameFr,
        descriptionAr: product.descriptionAr,
        descriptionFr: product.descriptionFr,
        categoryId: product.categoryId,
        brandId: product.brandId,
        basePrice: product.basePrice,
        currentStock: product.currentStock,
        isFeatured: product.isFeatured ?? false,
        isActive: product.isActive ?? true,
      }));

      await tx.product.createMany({
        data: productData,
        skipDuplicates: true
      });

      // Get the created products with their IDs
      const createdProducts = await tx.product.findMany({
        where: {
          sku: { in: skus }
        },
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: {
              sortOrder: 'asc'
            }
          },
          priceTiers: {
            orderBy: {
              minQuantity: 'asc'
            }
          }
        }
      });

      // Create product images for products that have imageUrl
      const imageData = [];
      for (let i = 0; i < input.length; i++) {
        const productInput = input[i];
        const createdProduct = createdProducts.find(p => p.sku === productInput.sku);
        
        if (productInput.imageUrl && createdProduct) {
          imageData.push({
            productId: createdProduct.id,
            imageUrl: productInput.imageUrl,
            sortOrder: 0,
            isPrimary: true
          });
        }
      }

      if (imageData.length > 0) {
        await tx.productImage.createMany({
          data: imageData
        });
      }

      // Return updated products with images
      const finalProducts = await tx.product.findMany({
        where: {
          sku: { in: skus }
        },
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: {
              sortOrder: 'asc'
            }
          },
          priceTiers: {
            orderBy: {
              minQuantity: 'asc'
            }
          }
        }
      });

      return {
        count: finalProducts.length,
        products: finalProducts
      };
    });
  }

  // Helper method to validate categories and brands exist
  private async validateReferences(categoryIds: string[], brandIds: string[]): Promise<void> {
    const [existingCategories, existingBrands] = await Promise.all([
      this.prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true }
      }),
      this.prisma.brand.findMany({
        where: { id: { in: brandIds } },
        select: { id: true }
      })
    ]);

    const existingCategoryIds = existingCategories.map(c => c.id);
    const existingBrandIds = existingBrands.map(b => b.id);

    const invalidCategories = categoryIds.filter(id => !existingCategoryIds.includes(id));
    const invalidBrands = brandIds.filter(id => !existingBrandIds.includes(id));

    if (invalidCategories.length > 0) {
      throw new BadRequestException(`Invalid category IDs: ${invalidCategories.join(', ')}`);
    }

    if (invalidBrands.length > 0) {
      throw new BadRequestException(`Invalid brand IDs: ${invalidBrands.join(', ')}`);
    }
  }

   updatePriceTier = async (
  id: string,
  minQuantity: number,
  pricePerUnit: number
): Promise<boolean> => {
  const existings = await this.prisma.priceTier.findUnique({ where: { id } });

  if (!existings) {
    return false;
  }

  const updating = await this.prisma.priceTier.update({
    where: { id },
    data: {
      minQuantity,
      pricePerUnit,
    },
  });

  return !!updating; // ensures boolean
};
   deletePriceTier = async (
  id: string,
): Promise<boolean> => {
  const existings = await this.prisma.priceTier.findUnique({ where: { id } });

  if (!existings) {
    return false;
  }

  const updating = await this.prisma.priceTier.delete({
    where: { id },
   
  });
  if(!updating){
    return false
  }
  return true; // ensures boolean
};


}
