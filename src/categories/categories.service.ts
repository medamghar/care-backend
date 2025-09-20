import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, CreateCategoryInput, UpdateCategoryInput } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    try {
      // Get all categories and build the hierarchy
      const categories = await this.prisma.category.findMany({
        orderBy: [
          { sortOrder: 'asc' },
          { nameAr: 'asc' }
        ],
        include: {
          parent: true,
          children: {
            orderBy: [
              { sortOrder: 'asc' },
              { nameAr: 'asc' }
            ],
            include: {
              children: {
                orderBy: [
                  { sortOrder: 'asc' },
                  { nameAr: 'asc' }
                ]
              }
            }
          }
        }
      });

      // Filter to return only root categories (those without parent)
      // Children will be included through the nested include
      return categories.filter(category => !category.parentId);
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          parent: true,
          children: {
            orderBy: [
              { sortOrder: 'asc' },
              { nameAr: 'asc' }
            ],
            include: {
              children: {
                orderBy: [
                  { sortOrder: 'asc' },
                  { nameAr: 'asc' }
                ]
              }
            }
          }
        }
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    try {
      // Validate parent category exists if parentId is provided
      if (input.parentId) {
        const parentExists = await this.prisma.category.findUnique({
          where: { id: input.parentId }
        });
        
        if (!parentExists) {
          throw new BadRequestException(`Parent category with ID ${input.parentId} not found`);
        }

        // Prevent circular references by checking if parent is a descendant
        const isCircular = await this.wouldCreateCircularReference(input.parentId, null);
        if (isCircular) {
          throw new BadRequestException('Cannot create circular reference in category hierarchy');
        }
      }

      const category = await this.prisma.category.create({
        data: {
          nameAr: input.nameAr,
          nameFr: input.nameFr,
          imageUrl: input.imageUrl,
          parentId: input.parentId || null,
          sortOrder: input.sortOrder || 0,
          isActive: input.isActive ?? true,
        },
        include: {
          parent: true,
          children: {
            orderBy: [
              { sortOrder: 'asc' },
              { nameAr: 'asc' }
            ]
          }
        }
      });

      return category;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    try {
      // Check if category exists
      const existingCategory = await this.prisma.category.findUnique({
        where: { id }
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Validate parent category exists if parentId is provided
      if (input.parentId !== undefined) {
        if (input.parentId) {
          const parentExists = await this.prisma.category.findUnique({
            where: { id: input.parentId }
          });
          
          if (!parentExists) {
            throw new BadRequestException(`Parent category with ID ${input.parentId} not found`);
          }

          // Prevent circular references
          const isCircular = await this.wouldCreateCircularReference(input.parentId, id);
          if (isCircular) {
            throw new BadRequestException('Cannot create circular reference in category hierarchy');
          }

          // Prevent setting self as parent
          if (input.parentId === id) {
            throw new BadRequestException('Category cannot be its own parent');
          }
        }
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: {
          ...(input.nameAr !== undefined && { nameAr: input.nameAr }),
          ...(input.nameFr !== undefined && { nameFr: input.nameFr }),
          ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
          ...(input.parentId !== undefined && { parentId: input.parentId || null }),
          ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
        include: {
          parent: true,
          children: {
            orderBy: [
              { sortOrder: 'asc' },
              { nameAr: 'asc' }
            ]
          }
        }
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      // Check if category exists
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
        include: {
          children: true
        }
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Check if category has products
      const productsCount = await this.prisma.product.count({
        where: { categoryId: id }
      });

      if (productsCount > 0) {
        throw new BadRequestException(
          `Cannot delete category: ${productsCount} products are assigned to this category`
        );
      }

      // Delete the category and all its children (CASCADE)
      await this.deleteRecursive(id);

      return true;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  async findByParentId(parentId: string | null): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { parentId },
        orderBy: [
          { sortOrder: 'asc' },
          { nameAr: 'asc' }
        ],
        include: {
          parent: true,
          children: {
            orderBy: [
              { sortOrder: 'asc' },
              { nameAr: 'asc' }
            ]
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to fetch categories by parent: ${error.message}`);
    }
  }

  async updateSortOrder(categoryId: string, newSortOrder: number): Promise<Category> {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { sortOrder: newSortOrder },
        include: {
          parent: true,
          children: {
            orderBy: [
              { sortOrder: 'asc' },
              { nameAr: 'asc' }
            ]
          }
        }
      });

      return updatedCategory;
    } catch (error) {
      throw new Error(`Failed to update sort order: ${error.message}`);
    }
  }

  async toggleActive(categoryId: string): Promise<Category> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { isActive: !category.isActive },
        include: {
          parent: true,
          children: {
            orderBy: [
              { sortOrder: 'asc' },
              { nameAr: 'asc' }
            ]
          }
        }
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to toggle category status: ${error.message}`);
    }
  }

  // Private helper methods
  private async deleteRecursive(categoryId: string): Promise<void> {
    // Get all children
    const children = await this.prisma.category.findMany({
      where: { parentId: categoryId }
    });

    // Recursively delete children first
    for (const child of children) {
      await this.deleteRecursive(child.id);
    }

    // Delete the category itself
    await this.prisma.category.delete({
      where: { id: categoryId }
    });
  }

  private async wouldCreateCircularReference(
    potentialParentId: string, 
    categoryId: string | null
  ): Promise<boolean> {
    if (!categoryId) return false;
    
    let currentParentId = potentialParentId;
    const visited = new Set<string>();

    while (currentParentId) {
      if (visited.has(currentParentId)) {
        // Infinite loop detected
        return true;
      }
      
      if (currentParentId === categoryId) {
        return true;
      }

      visited.add(currentParentId);
      
      const parent = await this.prisma.category.findUnique({
        where: { id: currentParentId },
        select: { parentId: true }
      });

      currentParentId = parent?.parentId || null;
    }

    return false;
  }

  // Additional utility methods
  async getCategoryPath(categoryId: string): Promise<Category[]> {
    const path: Category[] = [];
    let currentId = categoryId;

    while (currentId) {
      const category = await this.prisma.category.findUnique({
        where: { id: currentId },
        include: { parent: true }
      });

      if (!category) break;

      path.unshift(category);
      currentId = category.parentId;
    }

    return path;
  }

  async getCategoryDepth(categoryId: string): Promise<number> {
    const path = await this.getCategoryPath(categoryId);
    return path.length;
  }

  async getAllDescendants(categoryId: string): Promise<Category[]> {
    const descendants: Category[] = [];
    
    const getChildren = async (parentId: string) => {
      const children = await this.prisma.category.findMany({
        where: { parentId },
        include: { children: true }
      });

      for (const child of children) {
        descendants.push(child);
        await getChildren(child.id);
      }
    };

    await getChildren(categoryId);
    return descendants;
  }
}