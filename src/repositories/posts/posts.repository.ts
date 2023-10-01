
import Post from "@models/posts.model";

import { IPostRepository } from "./posts.interface";
import { paginateDto } from "@dtos/common.dto";
import Category from "@models/categories.model";
import Database from "../../database/mysql";
import { QueryTypes, Sequelize } from "sequelize";

const db = new Database();

class PostRepository implements IPostRepository {

    /** @route /admin/users/{user_id}/posts */
    public async allPostsByUserIdForAdmin(args: paginateDto, user_id: string): Promise<Post[]> {
        return [];
    }

    /** @route /users/posts */
    public async allPostsForUsers(_args: paginateDto): Promise<Post[] | any> {

        try {

            let queryStr = `
            select p.post_id, p.title, p.content, cat.name as category_name, p.created_at
            from posts p
            inner join categories cat on p.category_id = cat.category_id
            where p.status = 'published' 
            order by p.created_at desc
            limit ? offset ?`;

            let posts = await db.sequelize?.query(
                queryStr, {
                model: Post,
                mapToModel: true,
                replacements: [_args.limit, _args.page * _args.limit],
                type: QueryTypes.SELECT
            });

            let totalRow = await Post.count({ where: { status: 'published' } });

            return { posts: posts, total: totalRow };
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** @route /users/me/posts where status in draft and published*/
    public async allPostsByUserIdForUsers(user_id: string, _args: paginateDto): Promise<Post[] | any> {

        try {

            let queryStr = `
            select p.post_id, p.title, p.content, cat.name as category_name, p.created_at
            from posts p
            inner join categories cat on p.category_id = cat.category_id
            where p.status != 'reported' and p.created_by = ?
            order by p.created_at desc
            limit ? offset ?`;

            let posts = await db.sequelize?.query(
                queryStr, {
                model: Post,
                mapToModel: true,
                replacements: [user_id, _args.limit, _args.page * _args.limit],
                type: QueryTypes.SELECT
            });

            let totalRow = await Post.count({ where: { status: ['draft', 'published'] } });

            return { posts: posts, total: totalRow };
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** @route /users/posts/{post_id} */
    public async detailForUser(post_id: string): Promise<Post | any> {
        try {
            let post = await Post.findOne(
                {
                    include: [
                        {
                            model: Category,
                            attributes: []
                        }
                    ],
                    attributes: [
                        'post_id', 'title', 'content', 'created_at',
                        [Sequelize.literal('category.name'), 'category_name']
                    ],
                    where: {
                        status: 'published',
                        post_id: post_id
                    }
                }
            );

            if (!post) return Promise.reject("NO_TRANSACTION");

            return post;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** 
     * status in draft and published
     * @route /users/me/posts/{post_id} 
     * */
    public async detailByUserIdForUser(post_id: string, user_id: string): Promise<Post | any> {
        try {
            let post = await Post.findOne(
                {
                    include: [
                        {
                            model: Category,
                            attributes: []
                        }
                    ],
                    attributes: [
                        'post_id', 'title', 'content', 'created_at', 'status',
                        [Sequelize.literal('category.name'), 'category_name']
                    ],
                    where: {
                        post_id: post_id,
                        status: ['draft', 'published'],
                        created_by: user_id
                    }
                }
            );

            if (!post) return Promise.reject("NO_TRANSACTION");

            return post;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** @route /admin/users/{user_id}/posts/{post_id} */
    public async detailByUserIdForAdmin(post_id: string, user_id?: string): Promise<Post> {
        return new Post;
    }

    /** @oute /admin/posts/{post_id}/status */
    public async suspendPost(post_id: string): Promise<Post> {
        return new Post;
    }

    /** @route /user/post */
    public async create(_data: Post): Promise<Post> {

        try {
            let post = await Post.create({
                title: _data.title,
                content: _data.content,
                status: _data.status,
                category_id: _data.category_id,
                created_by: _data.created_by
            });

            let category = await Category.findByPk(_data.category_id);

            const { updated_at, updated_by, category_id, ...withoutUpdateInfo } = post.dataValues;

            return { ...withoutUpdateInfo, category_name: category?.name };
        } catch (err: any) {

            return Promise.reject(err);
        }
    }
}

export default new PostRepository();