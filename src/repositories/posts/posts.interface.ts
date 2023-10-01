import Post from "@models/posts.model";
// import {  } from "@dtos/posts.dto";
import { paginateDto } from "@dtos/common.dto";

export interface IPostRepository {

    /** @route /admin/users/{user_id}/posts */
    allPostsByUserIdForAdmin: (args: paginateDto, user_id: string) => Promise<Post[]>;

    /** @route /users/posts */
    allPostsForUsers: (args: paginateDto) => Promise<Post[]>;

    /** @route /users/me/posts */
    allPostsByUserIdForUsers: (user_id: string, args: paginateDto) => Promise<Post[]>;

    /** @route /users/posts/{post_id} */
    detailForUser: (post_id: string) => Promise<Post>;

    /** @route /users/me/posts/{post_id} */
    detailByUserIdForUser: (post_id: string, user_id: string) => Promise<Post>;

    /** @route /admin/users/{user_id}/posts/{post_id} */
    detailByUserIdForAdmin: (post_id: string, user_id: string) => Promise<Post>;

    /** @route /admin/posts/{post_id}/status */
    suspendPost: (post_id: string) => Promise<Post>;

    /** @route /user/post */
    create: (data: Post) => Promise<Post>;

    /** @put @route /user/me/post/{post_id} */
    publish: (post_id: string, user_id: string) => Promise<Post>;

    /** @delete @route /user/me/post/{post_id} */
    destroy: (post_id: string, user_id: string) => Promise<void>;

    /** @put @route /user/post/{post_id} */
    report: (post_id: string, user_id: string) => Promise<Post>;
}