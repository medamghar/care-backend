import { 
  Resolver, 
  Query, 
  Mutation, 
  Args, 
  ID, 
  Int,
  ResolveField,
  Parent,
  Context 
} from '@nestjs/graphql';
import { UseGuards, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category, CreateCategoryInput, UpdateCategoryInput } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Category)
export class CategoriesResolver {
  private readonly logger = new Logger(CategoriesResolver.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], {
    name: 'categories',
    description: 'Get all categories with hierarchical structure'
  })
  @UseGuards(JwtAuthGuard)
  async categories(): Promise<Category[]> {
    this.logger.log('Fetching all categories');
    return this.categoriesService.findAll();
  }

  @Query(() => Category, {
    name: 'category',
    description: 'Get a specific category by ID'
  })
  @UseGuards(JwtAuthGuard)
  async category(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
  ): Promise<Category> {
    this.logger.log(`Fetching category with ID: ${id}`);
    return this.categoriesService.findOne(id);
  }

  @Query(() => [Category], {
    name: 'categoriesByParent',
    description: 'Get categories by parent ID'
  })
  @UseGuards(JwtAuthGuard)
  async categoriesByParent(
    @Args('parentId', { 
      type: () => ID, 
      nullable: true,
      description: 'Parent category ID (null for root categories)' 
    }) parentId: string | null,
  ): Promise<Category[]> {
    this.logger.log(`Fetching categories by parent ID: ${parentId}`);
    return this.categoriesService.findByParentId(parentId);
  }

  @Query(() => [Category], {
    name: 'categoryPath',
    description: 'Get the full path from root to category'
  })
  @UseGuards(JwtAuthGuard)
  async categoryPath(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
  ): Promise<Category[]> {
    this.logger.log(`Fetching category path for ID: ${id}`);
    return this.categoriesService.getCategoryPath(id);
  }

  @Query(() => Int, {
    name: 'categoryDepth',
    description: 'Get the depth level of a category'
  })
  @UseGuards(JwtAuthGuard)
  async categoryDepth(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
  ): Promise<number> {
    this.logger.log(`Fetching category depth for ID: ${id}`);
    return this.categoriesService.getCategoryDepth(id);
  }

  @Query(() => [Category], {
    name: 'categoryDescendants',
    description: 'Get all descendants of a category'
  })
  @UseGuards(JwtAuthGuard)
  async categoryDescendants(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
  ): Promise<Category[]> {
    this.logger.log(`Fetching category descendants for ID: ${id}`);
    return this.categoriesService.getAllDescendants(id);
  }

  @Mutation(() => Category, {
    name: 'createCategory',
    description: 'Create a new category'
  })
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Args('input', { type: () => CreateCategoryInput }) input: CreateCategoryInput,
    @Context() context: any,
  ): Promise<Category> {
    const user = context.req.user;
    this.logger.log(`User ${user.email || user.id} creating category: ${input.nameAr}`);
    return this.categoriesService.create(input);
  }

  @Mutation(() => Category, {
    name: 'updateCategory',
    description: 'Update an existing category'
  })
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
    @Args('input', { type: () => UpdateCategoryInput }) input: UpdateCategoryInput,
    @Context() context: any,
  ): Promise<Category> {
    const user = context.req.user;
    this.logger.log(`User ${user.email || user.id} updating category with ID: ${id}`);
    return this.categoriesService.update(id, input);
  }

  @Mutation(() => Boolean, {
    name: 'deleteCategory',
    description: 'Delete a category and all its subcategories'
  })
  @UseGuards(JwtAuthGuard)
  async deleteCategory(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const user = context.req.user;
    this.logger.log(`User ${user.email || user.id} deleting category with ID: ${id}`);
    return this.categoriesService.remove(id);
  }

  @Mutation(() => Category, {
    name: 'updateCategorySortOrder',
    description: 'Update the sort order of a category'
  })
  @UseGuards(JwtAuthGuard)
  async updateCategorySortOrder(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
    @Args('sortOrder', { type: () => Int, description: 'New sort order' }) sortOrder: number,
    @Context() context: any,
  ): Promise<Category> {
    const user = context.req.user;
    this.logger.log(`User ${user.email || user.id} updating sort order for category ${id} to ${sortOrder}`);
    return this.categoriesService.updateSortOrder(id, sortOrder);
  }

  @Mutation(() => Category, {
    name: 'toggleCategoryActive',
    description: 'Toggle the active status of a category'
  })
  @UseGuards(JwtAuthGuard)
  async toggleCategoryActive(
    @Args('id', { type: () => ID, description: 'Category ID' }) id: string,
    @Context() context: any,
  ): Promise<Category> {
    const user = context.req.user;
    this.logger.log(`User ${user.email || user.id} toggling active status for category with ID: ${id}`);
    return this.categoriesService.toggleActive(id);
  }

  // Field resolvers for optimizing data fetching
  @ResolveField(() => Category, { nullable: true })
  async parent(@Parent() category: Category): Promise<Category | null> {
    if (!category.parentId) return null;
    
    // If parent is already loaded, return it
    if (category.parent) return category.parent;
    
    // Otherwise fetch it
    return this.categoriesService.findOne(category.parentId);
  }

  @ResolveField(() => [Category], { nullable: true })
  async children(@Parent() category: Category): Promise<Category[]> {
    // If children are already loaded, return them
    if (category.children) return category.children;
    
    // Otherwise fetch them
    return this.categoriesService.findByParentId(category.id);
  }

  // Additional field resolvers for computed fields
  @ResolveField(() => Boolean, {
    name: 'hasChildren',
    description: 'Check if category has children'
  })
  async hasChildren(@Parent() category: Category): Promise<boolean> {
    if (category.children) {
      return category.children.length > 0;
    }
    
    const children = await this.categoriesService.findByParentId(category.id);
    return children.length > 0;
  }

  @ResolveField(() => Int, {
    name: 'childrenCount',
    description: 'Number of direct children'
  })
  async childrenCount(@Parent() category: Category): Promise<number> {
    if (category.children) {
      return category.children.length;
    }
    
    const children = await this.categoriesService.findByParentId(category.id);
    return children.length;
  }

  @ResolveField(() => Int, {
    name: 'depth',
    description: 'Category depth level (0 for root categories)'
  })
  async depth(@Parent() category: Category): Promise<number> {
    return this.categoriesService.getCategoryDepth(category.id);
  }

  @ResolveField(() => [Category], {
    name: 'breadcrumb',
    description: 'Full path from root to this category'
  })
  async breadcrumb(@Parent() category: Category): Promise<Category[]> {
    return this.categoriesService.getCategoryPath(category.id);
  }

  @ResolveField(() => [Category], {
    name: 'descendants',
    description: 'All descendants of this category'
  })
  async descendants(@Parent() category: Category): Promise<Category[]> {
    return this.categoriesService.getAllDescendants(category.id);
  }

  @ResolveField(() => Int, {
    name: 'totalDescendants',
    description: 'Total number of descendants'
  })
  async totalDescendants(@Parent() category: Category): Promise<number> {
    const descendants = await this.categoriesService.getAllDescendants(category.id);
    return descendants.length;
  }
}