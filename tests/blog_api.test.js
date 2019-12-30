const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require("../models/blog")

beforeEach(async () => {
    console.log("INIT FOR TEST")
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
})

test('blogs are returned as json', async () => {
    console.log("TEST 1")
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
})

test('all blogs are returned', async () => {
    console.log("TEST 2")
    blogsAtEnd = await helper.blogsInDb()
    console.log("END BLOGS", blogsAtEnd)
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})
test('a valid blog can be added ', async () => {
    console.log("TEST 3")
    await api
        .post('/api/blogs')
        .send(helper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    console.log(blogsAtEnd)
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
    expect(titles).toContain(
        "Snaegis is testing"
    )
})
afterAll(() => {
    console.log("END")
    mongoose.connection.close()
})