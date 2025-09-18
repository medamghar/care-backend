import { CategoriesService } from './categories.service';
import { Category } from './dto/category.dto';
export declare class CategoriesResolver {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    categories(): Promise<Category[]>;
    category(id: string): Promise<Category>;
}
