import { NextFunction, Request, Response } from "express";
import postRepository from "../../repositories/posts/posts.repository";
import Utils from "../../utils/utils";
import message from "../../../config/response_message";
import Post from "@models/posts.model";

/** @route /users/posts */
export async function allPostsForUsers(req: Request | any, res: Response, next: NextFunction) {
    let page = req.query.page;
    let limit = req.query.limit

    // prevent sql injection
    if (!Utils.isNumber(page) || !Utils.isNumber(limit)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    postRepository.allPostsForUsers({ page: parseInt(page), limit: parseInt(limit) })
        .then((data: any) => {
            res.json({
                'post': data.posts,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': data.total
                }
            });
        })
        .catch((err: any) => {
            console.log(`Error ${err}`);

            res.json({
                status: "fail",
                data: err,
                message: message.other.something_wrong
            })
        });
}


/** @route /users/posts */
export async function allPostsByUserIdForUsers(req: Request | any, res: Response, next: NextFunction) {
    let page = req.query.page;
    let limit = req.query.limit

    const { id } = req.decoded;

    // prevent sql injection
    if (!Utils.isNumber(page) || !Utils.isNumber(limit)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    postRepository.allPostsByUserIdForUsers(id, { page: parseInt(page), limit: parseInt(limit) })
        .then((data: any) => {
            res.json({
                'post': data.posts,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': data.total
                }
            });
        })
        .catch((err: any) => {
            console.log(`Error ${err}`);

            res.json({
                status: "fail",
                data: err,
                message: message.other.something_wrong
            })
        });
}

/** @route /users/posts/{post_id} */
export async function detailForUser(req: Request | any, res: Response, next: NextFunction) {

    const post_id = req.params.post_id;

    // prevent sql injection
    if (!Utils.isUUid(post_id)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    postRepository.detailForUser(post_id)
        .then((data: any) => {
            res.json({
                'post': data
            });
        })
        .catch((err: any) => {
            console.log(`Error ${err}`);

            let msg = message.other.something_wrong;
            if (err == "NO_TRANSACTION")
                msg = message.general.no_transaction;

            res.json({
                status: "fail",
                data: err,
                message: msg
            })
        });
}

/** @route /users/me/posts/{post_id} */
export async function detailByUserIdForUser(req: Request | any, res: Response, next: NextFunction) {

    const post_id = req.params.post_id;

    // prevent sql injection
    if (!Utils.isUUid(post_id)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    const { id } = req.decoded;

    postRepository.detailByUserIdForUser(post_id, id)
        .then((data: any) => {
            res.json({
                'post': data,
            });
        })
        .catch((err: any) => {
            console.log(`Error ${err}`);

            let msg = message.other.something_wrong;
            if (err == "NO_TRANSACTION")
                msg = message.general.no_transaction;

            res.json({
                status: "fail",
                data: err,
                message: msg
            })
        });
}

/** @route /users/post */
export async function create(req: Request | any, res: Response, next: NextFunction) {

    const { id } = req.decoded;

    let post = await Post.build(req.body);
    post.created_by = id;

    await post.validate()
        .then((result: any) => {

            return postRepository.create(post);
        })
        .then((data: any) => {
            res.json({
                'post': data,
            });
        })
        .catch((err: any) => {
            console.log(`Error ${err}`);

            res.json({
                status: "fail",
                data: process.env.NODE_ENV == "development" ? err : {},
                message: message.general.create_fail
            })
        });
}


/*** @PUT @route /user/me/post/{post_id} */
export async function publish(req: Request | any, res: Response, next: NextFunction) {

    const post_id = req.params.post_id;

    // prevent sql injection
    if (!Utils.isUUid(post_id)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    const { id } = req.decoded;

    postRepository.publish(post_id, id)
        .then((data: any) => {
            res.json({
                'post': data,
            });
        })
        .catch((err: any) => {
            console.log(`Error ${err}`);

            let msg = message.other.something_wrong;
            if (err == "NO_TRANSACTION")
                msg = message.general.no_transaction;
            else if (err == "ALREADY_PUBLISHED")
                msg = message.post.already_published;
            else if (err == "REPORTED_POST")
                msg = message.post.reported_post;

            res.json({
                status: "fail",
                data: err,
                message: msg
            })
        });
}

/*** @PUT @route /user/me/post/{post_id} */
export async function destroy(req: Request | any, res: Response, next: NextFunction) {

    const post_id = req.params.post_id;

    // prevent sql injection
    if (!Utils.isUUid(post_id)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    const { id } = req.decoded;

    postRepository.destroy(post_id, id)
        .then((data: any) => {
            res.json({
                message: message.post.delete_success
            });
        })
        .catch((err: any) => {
            console.log(`Error ${err}`);

            let msg = message.other.something_wrong;
            if (err == "NO_TRANSACTION")
                msg = message.general.no_transaction;

            res.json({
                status: "fail",
                data: err,
                message: msg
            })
        });
}