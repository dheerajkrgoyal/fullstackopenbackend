const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if(blog){
		response.json(blog)
	}else{
		response.status(404).json({ error: 'blog not found' })
	}
})

blogsRouter.delete('/:id', async (request, response) => {
	const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
	if(deletedBlog){
		response.json(deletedBlog)
	}else{
		response.status(404).json({ error: 'blog not found' })
	}
})

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)
	const savedBlog = await blog.save(blog)
	response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body

	const blogToUpdate = {
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new : true, runValidators: true, context: 'query' })
	if(updatedBlog){
		response.json(updatedBlog)
	}else{
		response.status(404).json({ error: 'blog not found' })
	}
})

module.exports = blogsRouter