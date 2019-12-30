const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        console.log(blogs)
        response.json(blogs.map(b => b.toJSON()))
    } catch (error) {
        next(error)
    }
})

blogRouter.get("/:id", async (req, res, next) => {
    try {
        const blog = Blog.findById(req.params.id)
        if (blog) {
            return res.json(blog.toJSON())
        } else {
            return res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/', async (request, response, next) => {
    const blog = new Blog({
        ...request.body,
        likes: request.body.likes === undefined ?
            0 : request.body.likes

    })
    if (blog.title === undefined || blog.url === undefined) {
        response.status(400).send({ error: 'malformatted blog' })
        return
    }

    try {
        const saved = blog.save()
        response.status(201).json(saved.toJSON())
    } catch (error) {
        next(error)
    }
})

blogRouter.delete("/:id", async (req, res, next) => {
    try {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogRouter.put('/:id', async (req, res, next) => {
    try {
        const { body } = req
        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
        }
        const updated = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
        res.json(updated.toJSON())
    } catch (error) {
        next(error)
    }
})

module.exports = blogRouter