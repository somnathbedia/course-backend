import { NextFunction, Response, Request } from "express";

const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req: Request | any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.userId = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

export { authenticate }