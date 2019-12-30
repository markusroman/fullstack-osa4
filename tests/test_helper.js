const Blog = require('../models/blog')

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
    url: "ghfjkdlsdkfjhg",
    likes: 6
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

module.exports = {
    initialBlogs, newBlog, nonExistingId, blogsInDb
}