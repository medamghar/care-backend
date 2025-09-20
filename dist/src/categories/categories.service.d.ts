import { PrismaService } from '../prisma/prisma.service';
import { Category, CreateCategoryInput, UpdateCategoryInput } from './dto/category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: string, input: UpdateCategoryInput): Promise<Category>;
    remove(id: string): Promise<boolean>;
    findByParentId(parentId: string | null): Promise<Category[]>;
    updateSortOrder(categoryId: string, newSortOrder: number): Promise<Category>;
    toggleActive(categoryId: string): Promise<Category>;
    private deleteRecursive;
    private wouldCreateCircularReference;
    getCategoryPath(categoryId: string): Promise<Category[]>;
    getCategoryDepth(categoryId: string): Promise<number>;
    getAllDescendants(categoryId: string): Promise<Category[]>;
}
