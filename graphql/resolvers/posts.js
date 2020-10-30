const { AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post.js');
const checkAuth = require('../../util/check-auth.js');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                console.log(posts)
                return posts;
            } catch (error) {
                throw Error(error);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if(post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            
            const newPost = Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            console.log(newPost);

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if(user.username === post.username) {
                    await post.delete();
                    return 'Post delete successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    }
};