const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require("../models/user")
const jwt = require("jsonwebtoken")

blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
            .populate('user', { username: 1, name: 1 })
        response.json(blogs.map(b => b.toJSON()))
    } catch (error) {
        next(error)
    }
})

blogRouter.get("/:id", async (req, res, next) => {
    try {
        const blog = Blog.findById(req.params.id)
            .populate('notes', { username: 1, name: 1 })
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
    const body = request.body

    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(404).json({ error: 'user was not found' })
        }

        const blog = new Blog({
            user: decodedToken.id,
            likes: body.likes === undefined ? 0 : body.likes,
            ...body
        })

        const saved = await blog.save({ runValidators: true, context: 'query' })
        user.blogs = user.blogs.concat(saved._id)
        await user.save()
        response.status(201).json(saved.toJSON())
    } catch (error) {
        next(error)
    }
})

blogRouter.delete("/:id", async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (!req.token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: 'blog was not found' })
        }

        if (blog.user.toString() !== decodedToken.id) {
            return res
                .status(401)
                .json({ error: 'Invalid permission to delete this blog' });
        }
        await blog.remove()
        return res.status(204).end()

    } catch (error) {
        next(error)
    }
})

blogRouter.put('/:id', async (req, res, next) => {

    const { body } = req
    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: 'blog was not found' })
        }
        const updated = await Blog.findByIdAndUpdate(req.params.id, newBlog, { new: true })
        return res.json(updated.toJSON())
    } catch (error) {
        next(error)
    }
})

module.exports = blogRouter