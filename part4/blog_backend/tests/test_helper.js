const Blog = require('../models/blog')

const initialBlogs = [
	{
		title: 'HTML is easy',
		author: 'Dheeraj',
		url: 'http://example.com/blog/html',
		likes: 1,
	},
	{
		title: 'JS is easy',
		author: 'Ankur',
		url: 'http://example.com/blog/js',
		likes: 10,
	}
]

const nonExistingId = async () => {
	const blog = new Blog({ title: 'dummy', author: 'author', url: 'url', likes: 0 })
	await blog.save()
	await blog.deleteOne()
	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb }