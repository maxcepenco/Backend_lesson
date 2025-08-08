import express, { Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {UriParamsCourseIdModols} from "../models/UriParamsCourseIdModols";
import {CourseViewModel} from "../models/CourseViewModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
import {CourseType, DBType} from "../db/db";
import {HTTP_STATUS} from "../utils";





export const getCourseViewModel = (dbCourse:CourseType) => {

    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const getCoursesRouter = ( db: DBType) =>{

      const coursesRouter = express.Router();

    coursesRouter.get('/', (req: RequestWithQuery< QueryCoursesModel>, res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;
        if(req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
        }
        res.json(foundCourses.map(getCourseViewModel));

    });

    coursesRouter.get('/:id', (req: RequestWithParams<UriParamsCourseIdModols>, res: Response<CourseViewModel>) => {
        const foundCourse =db.courses.find(c => c.id === +req.params.id)
        if(!foundCourse){
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return;
        }


        res.json(getCourseViewModel(foundCourse));
    });

    coursesRouter.post('/',(req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
        // ИСПРАВЛЕНО: проверяем что title не пустой
        if(!req.body.title || req.body.title.trim() === '') {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
            return
        }

        const createdCourse:CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        }
        db.courses.push(createdCourse)
        res.status(HTTP_STATUS.CREATED_201);
        res.json(getCourseViewModel(createdCourse));
    })

    coursesRouter.put('/:id', (req:RequestWithParamsAndBody<UriParamsCourseIdModols, UpdateCourseModel> , res:Response) =>{
        // ИСПРАВЛЕНО: логика была обратной - должно быть !req.body.title
        if(!req.body.title || req.body.title.trim() === '') {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
            return
        }

        const foundCourse = db.courses.find(c => c.id === +req.params.id)
        if(!foundCourse) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
            return
        }

        foundCourse.title = req.body.title;

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    coursesRouter.delete('/:id', (req:RequestWithParams<UriParamsCourseIdModols>, res:Response) =>  {
        const idToDelete = +req.params.id;
        const found = db.courses.some(c => c.id === idToDelete);

        if(!found){
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
            return
        }

        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    return coursesRouter
}