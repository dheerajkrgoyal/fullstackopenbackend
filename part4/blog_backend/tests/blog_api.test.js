const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)


describe('when there is initially some blogs saved', async () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(helper.initialBlogs)
	})

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('there are initial blogs', async () => {
		const response = await api.get('/api/blogs')
		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})

	test('the first blog is about HTTP methods', async () => {
		const response = await api.get('/api/blogs')
		const titles = response.body.map(e => e.title)
		assert(titles.includes('HTML is easy'))
	})

	describe('blog addition test', async () => {
		test('valid blog can be added', async () => {
			const newNote = {
				title: 'testing blog add',
				author: 'testuser',
				url: 'http://example.com/blog/testing',
				likes: 100,
			}
			await api
				.post('/api/blogs')
				.send(newNote)
				.expect(201)
				.expect('Content-Type',/application\/json/)

			const blogsInDB = await helper.blogsInDb()
			assert.strictEqual(blogsInDB.length, helper.initialBlogs.length + 1)
			const titles = blogsInDB.map(blog => blog.title)

			assert(titles.includes('testing blog add'))
		})

		test('like property defaults to 0 when missing', async () => {
			const blogToAdd = {
				title: 'test title',
				author: 'testuser',
				url: 'testurl'
			}

			const savedBlog = await api.post('/api/blogs')
				.send(blogToAdd)
				.expect(201)
				.expect('Content-Type', /application\/json/)
			assert.strictEqual(savedBlog.body.likes, 0)

			const blogsInDb = await helper.blogsInDb()
			assert.strictEqual(blogsInDb.length, helper.initialBlogs.length + 1)
		})

		test('invalid blog without title cannot be added', async () => {
			const invalidNote = {
				author: 'testuser',
				url: 'http://test.com',
				likes: 1
			}

			await api
				.post('/api/blogs')
				.send(invalidNote)
				.expect(400)

			const blogsInDB = await helper.blogsInDb()
			assert.strictEqual(blogsInDB.length, helper.initialBlogs.length)
		})

		test('invalid blog without url cannot be added', async () => {
			const invalidNote = {
				title: 'testtitle',
				author: 'testuser',
				likes: 1
			}

			await api
				.post('/api/blogs')
				.send(invalidNote)
				.expect(400)

			const blogsInDB = await helper.blogsInDb()
			assert.strictEqual(blogsInDB.length, helper.initialBlogs.length)
		})
	})

	describe('blog fetch test', async () => {
		test('specific blog can be viewed', async () => {
			const blogsInDB = await helper.blogsInDb()

			const blogToFetch = blogsInDB[0]

			const result = await api
				.get(`/api/blogs/${blogToFetch.id}`)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			assert.deepStrictEqual(result.body, blogToFetch)
		})

		test('blog does not exist', async () => {
			const id = '000841aa0ab3fe8b64220000'
			const response = await api
				.get(`/api/blogs/${id}`)
				.expect(404)
				.expect('Content-Type',/application\/json/)
			assert.strictEqual(response.body.error, 'blog not found')
		})

		test('api returns 404 when id is not in correct format', async () => {
			const id = '0'
			const response = await api
				.get(`/api/blogs/${id}`)
				.expect(400)
				.expect('Content-Type', /application\/json/)
			assert.strictEqual(response.body.error, 'Cast to ObjectId failed for value "0" (type string) at path "_id" for model "Blog"')
		})
	})

	describe('blog delete test', async () => {
		test('specific blog can be deleted', async () => {
			const blogsInDB = await helper.blogsInDb()
			const blogToDelete = blogsInDB[0]

			const result = await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			assert.deepStrictEqual(result.body, blogToDelete)

			const blogsInDBAfterDelettion = await helper.blogsInDb()
			assert.strictEqual(blogsInDBAfterDelettion.length, helper.initialBlogs.length -1)
		})

		test('blog does not exist', async () => {
			const id = '000841aa0ab3fe8b64220000'
			const response = await api
				.delete(`/api/blogs/${id}`)
				.expect(404)
				.expect('Content-Type',/application\/json/)
			assert.strictEqual(response.body.error, 'blog not found')
		})

		test('api returns 404 when id is not in correct format', async () => {
			const id = '0'
			const response = await api
				.delete(`/api/blogs/${id}`)
				.expect(400)
				.expect('Content-Type', /application\/json/)
			assert.strictEqual(response.body.error, 'Cast to ObjectId failed for value "0" (type string) at path "_id" for model "Blog"')
		})
	})

	describe('blog update test', async () => {
		test('blog like can be updated', async () => {
			const blogsInDb = await helper.blogsInDb()
			const blogToUpdate = blogsInDb[0]

			blogToUpdate.likes = blogToUpdate.likes + 1

			const updatedBlog = await api
				.put(`/api/blogs/${blogToUpdate.id}`)
				.send(blogToUpdate)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			assert.strictEqual(updatedBlog.body.likes, helper.initialBlogs[0].likes + 1)
		})

		test('blog cannot be found while updating', async () => {
			const id = '000841aa0ab3fe8b64220000'

			const blogToUpdate = {
				title: 'test blog',
				likes: 100
			}

			const response = await api
				.put(`/api/blogs/${id}`)
				.send(blogToUpdate)
				.expect(404)
				.expect('Content-Type', /application\/json/)

			assert.strictEqual(response.body.error, 'blog not found')
		})

		test('api returns 404 when id is not in correct format', async () => {
			const id = '0'
			const response = await api
				.put(`/api/blogs/${id}`)
				.expect(400)
				.expect('Content-Type', /application\/json/)
			assert.strictEqual(response.body.error, 'Cast to ObjectId failed for value "0" (type string) at path "_id" for model "Blog"')
		})
	})
})

after(async () => {
	await mongoose.connection.close()
})