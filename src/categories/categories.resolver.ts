import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './dto/category.dto';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Query(() => Category)
  async category(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Category> {
    return this.categoriesService.findOne(id);
  }
}
