"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'automotion qa' },
        { id: 4, title: 'devops' }
    ]
};
app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
});
app.delete('/courses/:id', (req, res) => {
    const idToDelete = +req.params.id;
    const found = db.courses.some(c => c.id === idToDelete);
    if (!found) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const newCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(newCourse);
    res.status(201);
    res.json(newCourse);
});
app.post('/', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const newCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(newCourse);
    res.status(201);
    res.json(newCourse);
});
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
