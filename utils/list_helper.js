const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0
    if (blogs.length !== 0) {
        blogs.map(b => {
            total += b.likes
        })
    }

    return total
}

const favoriteBlog = (blogs) => {

    if (blogs.length === 0) {
        return {}
    }
    let curr_favorite = {
        likes: 0,
        title: "initblog"
    }
    blogs.map(b => {
        if (b.likes >= curr_favorite.likes || curr_favorite.title === "initblog") {
            curr_favorite = b
        }
    })
    return curr_favorite
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    let authorBlogs = new Map()
    blogs.map(b => {
        if (authorBlogs.get(b.author) !== undefined) {
            let temp = authorBlogs.get(b.author) + 1
            authorBlogs.set(b.author, temp)
        } else {
            authorBlogs.set(b.author, 1)
        }
    })
    let top = {
        author: "",
        blogs: 0
    }
    for (let [key, value] of authorBlogs) {
        if (value > top.blogs) {
            top.author = key
            top.blogs = value
        }
    }
    return (top)
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    let authorBlogs = new Map()
    blogs.map(b => {
        if (authorBlogs.get(b.author) !== undefined) {
            let temp = authorBlogs.get(b.author) + b.likes
            authorBlogs.set(b.author, temp)
        } else {
            authorBlogs.set(b.author, b.likes)
        }
    })
    let top = {
        author: "",
        likes: 0
    }
    for (let [key, value] of authorBlogs) {
        if (value > top.likes) {
            top.author = key
            top.likes = value
        }
    }
    return (top)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}