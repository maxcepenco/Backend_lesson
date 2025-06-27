import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

const   HTTP_STATUS = {
    OK_200:200,
    CREATED_201:201,
    NO_CONTENT_204:204,

    BAD_REQUEST_400:400,
    NOT_FOUND_404: 404,
}


const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware);

const db = {
    courses:[
        {id:1, title: 'front-end'},
        {id:2, title: 'back-end'},
        {id:3, title: 'automotion qa'},
        {id:4, title: 'devops'}
    ]
}

app.get('/courses', (req: Request, res: Response) => {
    let foundCourses = db.courses;
    if(req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
    res.json(foundCourses);

});

app.get('/courses/:id', (req: Request, res: Response) => {
    const foundCourse =db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse){
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return;
    }


    res.json(foundCourse)
});

app.delete('/courses/:id', (req, res) =>  {
    const idToDelete = +req.params.id;
    const found = db.courses.some(c => c.id === idToDelete);

    if(!found){
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return
    }

    db.courses = db.courses.filter(c => c.id !== +req.params.id)

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

app.post('/courses',(req: Request, res: Response) => {
    if(!req.body.title) {
        res.sendStatus(400)
        return
    }

    const newCourse = {
        id: +(new Date()),
        title: req.body.title
    }
    db.courses.push(newCourse)
    res.status(201);
    res.json(newCourse);
})


app.post('/',(req: Request, res: Response) => {
    if(!req.body.title) {
        res.sendStatus(400)
        return
    }

    const newCourse = {
        id: +(new Date()),
        title: req.body.title
    }
    db.courses.push(newCourse)
    res.status(201);
    res.json(newCourse);
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
