const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs.map(blog => blog.toJSON()));
        })
        .catch(error => next(error))
})

blogRouter.get("/:id", (req, res, next) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (blog) {
                return res.json(blog.toJSON())
            } else {
                return res.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog({
        ...request.body,
        likes: request.body.likes === undefined ?
            0 : request.body.likes

    })
    if (blog.title === undefined || blog.url === undefined) {
        response.status(400).send({ error: 'malformatted blog' })
        return
    }


    blog
        .save()
        .then(result => {
            response.status(201).json(result.toJSON())
        })
        .catch(error => next(error))
})

blogRouter.delete("/:id", (req, res) => {
    Blog.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

blogRouter.put('/:id', (req, res) => {
    const { body } = req
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

module.exports = blogRouter