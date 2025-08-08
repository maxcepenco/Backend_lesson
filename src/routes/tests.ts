import express,{Express, Request, Response, } from "express";
import {DBType} from "../db/db";
import {HTTP_STATUS} from "../utils";



export const getTestsRouter = ( db:DBType) => {

    const router = express.Router();

    router.delete('/data', (req:Request, res: Response) => {
        db.courses = []
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    return router
}