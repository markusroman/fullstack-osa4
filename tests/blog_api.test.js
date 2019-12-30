const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require("../models/blog")


describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        response = await api.get("/api/blogs")
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('identifying field is named id', async () => {
        const response = await api.get('/api/blogs');
        response.body.map(b => expect(b.id).toBeDefined())
    })

    test('all blogs are returned', async () => {
        blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)
        expect(titles).toContain("Snaegis was here")
    })

    describe('viewing a specific blog', () => {

        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToView = blogsAtStart[0]
            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            expect(resultBlog.body).toEqual(blogToView)




        })

        test('fails with statuscode 404 if note does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/blogs/${invalidId}`)
                .expect(400)
        })
    })

    describe('addition of a new blog', () => {
        test('a valid blog can be added ', async () => {
            await api
                .post('/api/blogs')
                .send(helper.newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            const titles = blogsAtEnd.map(b => b.title)
            expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
            expect(titles).toContain(helper.newBlog.title)
        })

        test("Faulty blog is not added", async () => {
            await api
                .post('/api/blogs')
                .send(helper.faultyBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
        })

        test("if blog's likes is undefined set likes to 0", async () => {
            response = await api
                .post('/api/blogs')
                .send(helper.newBlog)
            expect(response.body.likes).toBeDefined()
            expect(response.body.likes).toBe(0)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            expect(blogsAtEnd.length).toBe(
                helper.initialBlogs.length - 1
            )

            const titles = blogsAtEnd.map(b => b.title)

            expect(titles).not.toContain(blogToDelete.title)
        })
    })
    describe("Updating an existing blog", () => {
        test("succeeds with valid parameters", async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            console.log("HAETTU ID", blogToUpdate.id, "LÄHETETTY", helper.updateBlog)
            updatedBlog = await api.put(`api/blogs/${blogToUpdate.id}`)
                .send(helper.updateBlog)
            console.log("SAATU", updatedBlog.body)
            expect(updatedBlog.title).toEqual(helper.updateBlog.title)
            expect(updatedBlog.id).toEqual(blogToUpdate.id)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})