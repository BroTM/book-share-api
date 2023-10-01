import Category from "@models/categories.model";
import { paginateDto } from "@dtos/common.dto";
import { updateCategoryDto } from "@dtos/categories.dto";

export interface ICategoryRepository {

    /** @route /users/categories */
    allCategoriesForUsers: () => Promise<Category[]>;

    /** @route /admin/categories */
    allCategoriesForAdmin: (args: paginateDto) => Promise<Category[]>;

    /** @route /admin/categories */
    create: (data: Category) => Promise<Category>;

    /** @route /admin/categories/{category_id} */
    getOne: (id: string) => Promise<Category>;

    /** @route /admin/categories/{category_id} */
    update: (id: string, data: updateCategoryDto) => Promise<Category>;

    /** @route /admin/categories/{category_id} */
    destroy: (id: string) => Promise<void>;
}