import { ICategoryRepository } from "./categories.interface";
import Category from "@models/categories.model";
import Database from "../../database/mysql";
import { paginateDto } from "@dtos/common.dto";
import { QueryTypes, Sequelize } from "sequelize";
import Admin from "@models/admins.model";
import { current_timestamp } from "../../utils/common";
import { updateCategoryDto } from "@dtos/categories.dto";

const db = new Database();

class CategoryRepository implements ICategoryRepository {

    /** @route /users/categories */
    public async allCategoriesForUsers(): Promise<Category[]> {

        try {
            let categories = await Category.findAll({ attributes: ['category_id', 'name'] });

            return categories;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** @route /admins/categories */
    public async allCategoriesForAdmin(_args: paginateDto): Promise<Category[] | any> {

        try {

            let queryStr = `
            select cat.category_id, cat.name, cat.created_at, cat.updated_at,
            c_user.user_name as created_name,
            u_user.user_name as updated_name
            from categories cat
            inner join users c_user on cat.created_by = c_user.user_id
            left join users u_user on cat.updated_by = u_user.user_id
            order by cat.created_at desc
            limit ? offset ?`;

            let categories = await db.sequelize?.query(
                queryStr, {
                model: Category,
                mapToModel: true,
                replacements: [_args.limit, _args.page * _args.limit],
                type: QueryTypes.SELECT
            });

            let totalRow = await Category.count();

            return { categories: categories, total: totalRow };
        } catch (err: any) {
            return Promise.reject(err);
        }
    }


    /** @route /admins/categories */
    public async create(_data: Category): Promise<Category | any> {

        try {
            let category = await Category.create({
                name: _data.name,
                created_by: _data.created_by,
                updated_by: _data.updated_by,
                updated_at: current_timestamp()
            });

            let admin = await Admin.findByPk(_data.created_by);

            return { ...category.dataValues, created_by: admin?.name, updated_by: admin?.name };
        } catch (err: any) {

            return Promise.reject(err);
        }
    }

    /** @route /admins/categories/{category_id} */
    public async getOne(id: string): Promise<Category> {

        try {
            let queryStr = `
            select cat.category_id, cat.name, cat.created_at, cat.updated_at,
            c_user.user_name as created_name,
            u_user.user_name as updated_name
            from categories cat
            inner join users c_user on cat.created_by = c_user.user_id
            left join users u_user on cat.updated_by = u_user.user_id
            where cat.category_id =?;`;

            let category = await db.sequelize?.query(
                queryStr, {
                model: Category,
                mapToModel: true,
                replacements: [id],
                type: QueryTypes.SELECT
            });


            if (!category || !category.length) return Promise.reject("NO_TRANSACTION");

            return category[0];
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** @route /admins/categories/{category_id} */
    public async update(id: string, _data: updateCategoryDto): Promise<Category> {

        try {
            let category = await Category.findOne({ where: { category_id: id } });

            if (!category) return Promise.reject("NO_TRANSACTION");

            category.name = _data.name;
            category.updated_by = _data.updated_by;
            category.updated_at = current_timestamp();

            let affectedRows = await category.save();

            return await this.getOne(id)
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** 
     * @delete @route /admin/categories/{category_id}
     * */
    public async destroy(id: string): Promise<void> {
        try {
            let category = await Category.findOne(
                {
                    where: {
                        category_id: id,
                    }
                }
            );

            if (!category) return Promise.reject("NO_TRANSACTION");

            let affectedRows = await category.destroy();

            return;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }
}

export default new CategoryRepository();
