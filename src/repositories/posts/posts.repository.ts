
import Post from "@models/posts.model";

import { IPostRepository } from "./posts.interface";
import { paginateDto } from "@dtos/common.dto";
import Category from "@models/categories.model";
import Database from "../../database/mysql";
import { QueryTypes, Sequelize } from "sequelize";
import { current_timestamp } from "../../utils/common";
import User from "@models/users.model";

const db = new Database();

class PostRepository implements IPostRepository {

    /** 
     * all no draft post
     * @route /admin/users/{user_id}/posts */
    public async allPostsByUserIdForAdmin(_args: paginateDto, user_id: string): Promise<Post[] | any> {

        try {

            let queryStr = `
            select p.post_id, p.title, p.content, p.status, p.created_at, p.updated_at, 
            cat.name as category_name,
            c_user.user_name as created_name,
            u_user.user_name as updated_name
            from posts p
            inner join categories cat on p.category_id = cat.category_id
            inner join users c_user on p.created_by = c_user.user_id
            left join users u_user on p.updated_by = u_user.user_id
            where p.status != 'draft' and p.created_by = ?
            order by p.created_at desc
            limit ? offset ?`;

            let posts = await db.sequelize?.query(
                queryStr, {
                model: Post,
                mapToModel: true,
                replacements: [user_id, _args.limit, _args.page * _args.limit],
                type: QueryTypes.SELECT
            });

            let totalRow = await Post.count({ where: { status: ['reported', 'published'] } });

            return { posts: posts, total: totalRow };
        } catch (err: any) {
            return Promise.reject(err);
        }
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
    public async detailByUserIdForAdmin(post_id: string, user_id: string): Promise<Post> {
        try {
            let post = await Post.findOne(
                {
                    include: [
                        {
                            model: Category,
                            attributes: []
                        },
                        {
                            model: User,
                            attributes: [],
                            as: "created_user"
                        },
                        {
                            model: User,
                            attributes: [],
                            as: "updated_user"
                        }
                    ],
                    attributes: [
                        'post_id', 'title', 'content', 'created_at', 'status', 'updated_at',
                        [Sequelize.literal('category.name'), 'category_name'],
                        [Sequelize.literal('created_user.user_name'), 'created_name'],
                        [Sequelize.literal('updated_user.user_name'), 'updated_name']

                    ],
                    where: {
                        post_id: post_id,
                        status: ['reported', 'published'],
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

    /** 
     * draft to publish
     * auth user must be owner
     * @PUT @route /user/me/post/{post_id} */
    public async publish(post_id: string, user_id: string): Promise<Post> {
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
                        created_by: user_id
                    }
                }
            );

            // may be it not post ower
            if (!post) return Promise.reject("NO_TRANSACTION");

            // user fault
            if (post.status == "published")
                return Promise.reject('ALREADY_PUBLISHED');

            if (post.status == "reported")
                return Promise.reject('REPORTED_POST');

            post.status = 'published';
            post.updated_at = current_timestamp();
            post.updated_by = user_id;
            //make more other colum, update

            let affectedRows = await post.save();

            let { updated_at, updated_by, ...withoutUpdateInfo } = post.dataValues;

            return withoutUpdateInfo;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** 
     * auth user must be owner
     * @delete @route /user/me/post/{post_id} 
     * */
    public async destroy(post_id: string, user_id: string): Promise<void> {
        try {
            let post = await Post.findOne(
                {
                    where: {
                        post_id: post_id,
                        created_by: user_id
                    }
                }
            );

            // may be it not post ower
            if (!post) return Promise.reject("NO_TRANSACTION");

            let affectedRows = await post.destroy();

            return;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    /** 
     * JSON_Array.push(user_id)
     * @PUT @route /user/post/{post_id}/report */
    public async report(post_id: string, user_id: string): Promise<Post> {
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
                        'post_id', 'title', 'content', 'created_at', 'status', 'reported_user_ids',
                        [Sequelize.literal('category.name'), 'category_name']
                    ],
                    where: {
                        status: ['published', 'reported'],
                        post_id: post_id
                    }
                }
            );

            // valid uuid, but not in table
            if (!post) return Promise.reject("NO_TRANSACTION");

            let arr: String[];
            if (!Array.isArray(JSON.parse(post.reported_user_ids)))
                arr = [];
            else
                arr = JSON.parse(post.reported_user_ids);

            let found = arr.find((elm) => elm == user_id);

            //prevent duplicate user_id
            if (!found)
                arr.push(user_id);

            post.updated_at = current_timestamp();
            post.updated_by = user_id;
            post.reported_user_ids = JSON.stringify(arr);

            let affectedRows = await post.save();

            let { reported_user_ids, updated_at, updated_by, ...withoutUpdateInfo } = post.dataValues;

            return withoutUpdateInfo;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }


    /** 
     * publish to reported
     * auth user must be owner
     * @PUT @route /user/me/post/{post_id} */
    public async reportStatus(post_id: string, admin_id: string): Promise<Post> {
        try {
            let post = await Post.findOne(
                {
                    include: [
                        {
                            model: Category,
                            attributes: []
                        },
                        {
                            model: User,
                            attributes: [],
                            as: "created_user"
                        },
                        {
                            model: User,
                            attributes: [],
                            as: "updated_user"
                        }
                    ],
                    attributes: [
                        'post_id', 'title', 'content', 'created_at', 'status', 'updated_at',
                        [Sequelize.literal('category.name'), 'category_name'],
                        [Sequelize.literal('created_user.user_name'), 'created_name'],
                        [Sequelize.literal('updated_user.user_name'), 'updated_name']

                    ],
                    where: {
                        post_id: post_id,
                        status: ['reported', 'published']
                    }
                }
            );

            if (!post) return Promise.reject("NO_TRANSACTION");

            // user fault
            if (post.status == "reported")
                return Promise.reject('ALREADY_REPORTED');

            post.status = 'reported';
            post.updated_at = current_timestamp();
            post.updated_by = admin_id;

            let affectedRows = await post.save();

            let { updated_at, updated_by, ...withoutUpdateInfo } = post.dataValues;

            return withoutUpdateInfo;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }
}

export default new PostRepository();