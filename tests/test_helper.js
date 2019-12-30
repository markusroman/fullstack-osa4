const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Snaegis was here",
        author: "Make",
        url: "ghfjkdlsdkfjhg",
        likes: 6
    },
    {
        title: "Snaegis was here too",
        author: "Make",
        url: "lkfjghfdhjskl",
        likes: 28
    }
]

const newBlog = {
    title: "Snaegis is testing",
    author: "Make",
    url: "ghfjkdlsdkfjhg"
}

const updateBlog = {
    title: "Snaegis 2.0",
    author: "Makeboi",
    url: "ghfjkdlsdkfjhg",
    likes: 0
}

const faultyBlog = {
    author: "Make",
    likes: 7
}

const nonExistingId = async () => {
    const blog = new Blog(newBlog)
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    newBlog,
    updateBlog,
    faultyBlog,
    nonExistingId,
    blogsInDb,
    usersInDb,
}