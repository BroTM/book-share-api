import { NextFunction, Request, Response } from "express";
import categoriesRepository from "../../repositories/categories/categories.repository";
import Utils from "../../utils/utils";
import message from "../../../config/response_message";
import Category from "@models/categories.model";

/** @route /users/categories */
export async function allCategoriesForUsers(req: Request | any, res: Response, next: NextFunction) {

    categoriesRepository.allCategoriesForUsers()
        .then((data: any) => {
            res.json({
                'categories': data
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

/** @route /admin/categories */
export async function allCategoriesForAdmin(req: Request | any, res: Response, next: NextFunction) {
    let page = req.query.page;
    let limit = req.query.limit

    // prevent sql injection
    if (!Utils.isNumber(page) || !Utils.isNumber(limit)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    categoriesRepository.allCategoriesForAdmin({ page: parseInt(page), limit: parseInt(limit) })
        .then((data: any) => {
            res.json({
                'categories': data.categories,
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


/** @route /admins/categories */
export async function create(req: Request | any, res: Response, next: NextFunction) {

    const { id } = req.decoded;

    let category = await Category.build(req.body);
    category.created_by = id;

    await category.validate()
        .then((result: any) => {

            return categoriesRepository.create(category);
        })
        .then((data: any) => {
            res.json({
                'category': data,
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

/** @route /admins/categories */
export async function getOne(req: Request | any, res: Response, next: NextFunction) {
    let category_id = req.params.category_id

    // prevent sql injection
    if (!Utils.isUUid(category_id)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    categoriesRepository.getOne(category_id)
        .then((data: any) => {
            res.json({
                'category': data,
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


/** @route /admins/categories/{category_id} */
export async function update(req: Request | any, res: Response, next: NextFunction) {
    let category_id = req.params.category_id;

    let { id } = req.decoded;
    let { name } = req.body;

    categoriesRepository.update(category_id, { name: name, updated_by: id })
        .then((data: any) => {
            res.json({
                'category': data,
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

/*** @route /admins/categories/{category_id}} */
export async function destroy(req: Request | any, res: Response, next: NextFunction) {

    const category_id = req.params.category_id;

    // prevent sql injection
    if (!Utils.isUUid(category_id)) {
        return res.status(405).send({ message: message.req_err.err_405 })
    }

    categoriesRepository.destroy(category_id)
        .then((data: any) => {
            res.json({
                message: message.category.delete_success
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