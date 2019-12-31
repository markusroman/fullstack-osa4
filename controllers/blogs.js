const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

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

    const token = getTokenFrom(request)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            user: user._id,
            likes: body.likes === undefined ? 0 : body.likes,
            author: body.author === undefined ? user.name : body.author,
            ...body
        })

        console.log("BLOG TO ADD", blog)

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
        const updated = await Blog.findByIdAndUpdate(req.params.id, blog,
            { new: true, runValidators: true, context: 'query' })
        res.json(updated.toJSON())
    } catch (error) {
        next(error)
    }
})

module.exports = blogRouter