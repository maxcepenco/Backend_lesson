import request from 'supertest'

import {app} from '../../src/app'
import {CreateCourseModel} from "../../src/models/CreateCourseModel";
import {HTTP_STATUS} from "../../src/utils";


describe('/course', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return  200 and empty array', async () => {
        await  request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200,[])
    })

    it('should return  404 for not existing course', async () => {
        await  request(app)
            .get('/courses/1')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    it(`should'nt create course with incorrect input data`, async () => {
        await request(app)
            .post('/courses')
            .send({title:''})
            .expect(HTTP_STATUS.BAD_REQUEST_400)
        await  request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200,[])
    })

    let createCourse:any = null;
    it(`should create course with correct input data`, async () => {

        const data: CreateCourseModel = {title: 'it-incubator course'};
        const createResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUS.CREATED_201)
        createCourse = createResponse.body;

        expect(createCourse).toEqual({
            id: expect.any(Number),
            title: 'it-incubator course'
        })



    })

    let createCourse2:any = null;
    it(`create one more course 2`, async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title:'it-incubator course 2'})
            .expect(HTTP_STATUS.CREATED_201)
        createCourse2 = createResponse.body;

        expect(createCourse2).toEqual({
            id:expect.any(Number),
            title: 'it-incubator course 2',
        })
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [createCourse,createCourse2])
    })

    it(`should'nt update with incorrect input data`, async () => {
        await request(app)
            .put(`/courses/` +createCourse.id)
            .send({title: ''})
            .expect(HTTP_STATUS.BAD_REQUEST_400)

        await request(app)
            .get('/courses/' + createCourse.id)
            .expect(HTTP_STATUS.OK_200, createCourse)

    })

    it(`should'nt update course that non exist`, async () => {
        await request(app)
            .put(`/courses/` + 9999999)
            .send({title: 'good course'})
            .expect(HTTP_STATUS.NOT_FOUND_404) // ИСПРАВЛЕНО: должен быть 404
    })

    it(`should update course that non exist`, async () => {
        await request(app)
            .put(`/courses/` + -100)
            .send({title: 'good course'})
            .expect(HTTP_STATUS.NOT_FOUND_404) // ИСПРАВЛЕНО: должен быть 404
    })

    it(`should update course with correct input data`, async () => {
        await request(app)
            .put(`/courses/` + createCourse.id)
            .send({title: 'good title'})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createCourse.id) // ИСПРАВЛЕНО: добавил недостающий слеш
            .expect(HTTP_STATUS.OK_200, {
                ...createCourse,
                title: 'good title',
            })
        await request(app)
            .get('/courses/' + createCourse2.id)
            .expect(HTTP_STATUS.OK_200, createCourse2)

    })

    it(`should delete both courses`, async () => {

        await request(app)
            .delete(`/courses/` + createCourse.id)
            .expect(HTTP_STATUS.NO_CONTENT_204)
        await request(app)
            .get(`/courses/` + createCourse.id)
            .expect(HTTP_STATUS.NOT_FOUND_404)

        await request(app)
            .delete(`/courses/` + createCourse2.id)
            .expect(HTTP_STATUS.NO_CONTENT_204)
        await request(app)
            .get(`/courses/` + createCourse2.id)
            .expect(HTTP_STATUS.NOT_FOUND_404)

        await request(app)
            .get('/courses/')
            .expect(HTTP_STATUS.OK_200, [])
    })



})