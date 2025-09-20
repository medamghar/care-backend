import { CategoriesService } from './categories.service';
import { Category, CreateCategoryInput, UpdateCategoryInput } from './dto/category.dto';
export declare class CategoriesResolver {
    private readonly categoriesService;
    private readonly logger;
    constructor(categoriesService: CategoriesService);
    categories(): Promise<Category[]>;
    category(id: string): Promise<Category>;
    categoriesByParent(parentId: string | null): Promise<Category[]>;
    categoryPath(id: string): Promise<Category[]>;
    categoryDepth(id: string): Promise<number>;
    categoryDescendants(id: string): Promise<Category[]>;
    createCategory(input: CreateCategoryInput, context: any): Promise<Category>;
    updateCategory(id: string, input: UpdateCategoryInput, context: any): Promise<Category>;
    deleteCategory(id: string, context: any): Promise<boolean>;
    updateCategorySortOrder(id: string, sortOrder: number, context: any): Promise<Category>;
    toggleCategoryActive(id: string, context: any): Promise<Category>;
    parent(category: Category): Promise<Category | null>;
    children(category: Category): Promise<Category[]>;
    hasChildren(category: Category): Promise<boolean>;
    childrenCount(category: Category): Promise<number>;
    depth(category: Category): Promise<number>;
    breadcrumb(category: Category): Promise<Category[]>;
    descendants(category: Category): Promise<Category[]>;
    totalDescendants(category: Category): Promise<number>;
}
