const dummy = () => {
	return 1
}

const totalLikes = (blogs) => {
	const sumLikes =  blogs.reduce((totalLikes, blog) => {
		return totalLikes + blog.likes
	}, 0)
	return sumLikes
}

const favoriteBlog = (blogs) => {
	const favorite = blogs.length === 0 ? {} : blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog )
	return favorite
}

const mostBlog = (blogs) => {
	const groupedBlog = blogs.reduce((group, blog) => {
		group[blog.author] = group[blog.author] + 1 || 1
		return group
	}, {})

	const parsedBlog = Object.entries(groupedBlog).map(entry => [{ 'author': entry[0], 'blogs': entry[1] }])
	const mostBlog =  parsedBlog.reduce((max, blog) => max.blogs > blog[0].blogs ? max : blog[0])
	return mostBlog
}

const mostLikes = (blogs) => {
	const groupedBlog = blogs.reduce((group, blog) => {
		group[blog.author] = group[blog.author] + blog.likes || blog.likes
		return group
	}, {})

	const parsedBlog = Object.entries(groupedBlog).map(entry => [{ 'author': entry[0], 'likes': entry[1] }])
	const mostLikes =  parsedBlog.reduce((max, blog) => max.likes > blog[0].likes ? max : blog[0])
	return mostLikes
}

module.exports = { dummy, totalLikes , favoriteBlog, mostBlog, mostLikes }