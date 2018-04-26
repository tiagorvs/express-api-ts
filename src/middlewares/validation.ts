import {Config} from '../config';
import {UserRoleEnums} from "../enums";
import {Translation} from "../translations";
import * as express from "express";
import {UserServices} from "../services";
import {ErrorApi, Token, User} from "../models";

export const ValidationMiddleware = {

    isRole: (role: number, req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = new Token(req.body.token);
        UserServices.isTokenValid(token).then((user: User) => {
            if (user && user.role >= role) {
                return next();
            } else {
                return res.json(new ErrorApi(403, Translation[Config.language].UNAUTHORIZED_ACCESS));
            }
        }, e => {
            console.log(e);
            return res.json(new ErrorApi(403, e.message));
        });
    },

    isPublic: (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        return ValidationMiddleware.isRole(UserRoleEnums.PUBLIC, req, res, next);
    },

    isMember: (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        return ValidationMiddleware.isRole(UserRoleEnums.MEMBER, req, res, next);
    },

    isManager: (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        return ValidationMiddleware.isRole(UserRoleEnums.MANAGER, req, res, next);
    },

    isAdmin: (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        return ValidationMiddleware.isRole(UserRoleEnums.ADMIN, req, res, next);
    }

};
