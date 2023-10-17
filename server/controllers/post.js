import User from '../models/user.js'
import Post from '../models/post.js'
import Comment from '../models/comment.js'
import crypt from 'crypto'
import { connect_database } from '../config.js'


export const likePost = async (req, res) => {
    console.log('from like-post', req.body.postId); 
  // try {
    const { postId, userId } = req.body;

    const [post, user] = await Promise.all([
      Post.findById(postId),
      User.findById(userId),
    ]);

    if (!user || !post) {
      return res.status(404).json({
        success: false,
        msg: 'Could not find the post or user.',
      });
    }
    const liked = post.likes.includes(user._id.toString());

    if (!liked) {
      post.likes.push(user._id.toString());
    } else {
      const likes = post.likes.filter((like) => like.toString() !== userId);
      post.likes = likes;
    }
    const updatedPost = await post.save();

    if (!updatedPost) {
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while updating the post.',
      });
    }

    await updatedPost.populate('comments by comments.by comments.comments tags');

    console.log({updatedPost})

    return res.status(200).json({
      success: true,
      post: updatedPost,
    });
  // } catch (error) {
  //   console.error({ Message: error.message, error });
  //   return res.status(500).json({
  //     success: false,
  //     msg: 'There was an error.',
  //   });
  // }
};


export const savePost = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        let [post, user] = await Promise.all([
            Post.findById(postId),
            User.findById(userId)
        ]);
        if (!user || !post) return res.status(500).send({
            msg: 'There was an error saving the post!'
        })

        const isSaved = user.savedPosts.includes(postId); 
        if(!isSaved)user.savedPosts.push(post._id);
        else {
            const savedPosts = user.savedPosts.filter(savedPostId => savedPostId.toString() !== postId); 
            user.savedPosts = savedPosts; 
        }
        await user.save();

        return res.status(200).json({
            user
        })
    } catch (error) {
        console.error({ Message: error.message, error });
        return res.status(500).json({
            success: false,
            msg: 'There was an error.',
        });
    }
}

export const deleteComment = async (req, res) => {
    connect_database();

    try {
        const { commentId } = req.body; 
        const userId = req.id;

        const [comment, user] = await Promise.all([
            Comment.findById(commentId),
            User.findById(userId).populate('comments'),
        ]);

        if (!comment || !user) {
            return res.status(500).json({
                msg: 'Error deleting the comment.',
            });
        }

        const userComments = user.comments.filter((commentItem) => commentItem._id.toString() !== commentId);
        user.comments = userComments;
        await user.save();

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            msg: 'Comment deleted successfully.',
        });

    } catch (error) {
        console.log({ message: error.message });
        res.status(500).json({
            success: false,
            msg: 'An error occurred.',
        });
    }
};

export const deletePost = async (req, res) => {
    connect_database();

    try {
        const { postId } = req.body; 
        const userId = req.id;

        const [post, user] = await Promise.all([
            Post.findById(postId),
            User.findById(userId).populate('posts'),
        ]);

        if (!post || !user) {
            return res.status(500).json({
                msg: 'Error deleting the post.',
            });
        }

        const userPosts = user.posts.filter((postItem) => post._id.toString() !== postId);
        user.posts = userPosts;
        await user.save();

        await Post.findByIdAndDelete(postId);

        res.status(200).json({
            success: true,
            msg: 'Post deleted successfully.',
        });

    } catch (error) {
        console.log({ message: error.message });
        res.status(500).json({
            success: false,
            msg: 'An error occurred.',
        });
    }
};


export const getPostById = async (req, res) => {
    connect_database();

    try {
        const { postId } = req.body;
        console.log({postId})
        const post = await Post.findById(postId)
            .populate('by')
            .populate({
              path: 'comments',
              populate: [
                { path: 'by' },
                {
                  path: 'comments',
                  populate: { path: 'by' },
                },
              ],
            })
            .populate('tags')

        if (!post) return res.status(500).json({
            msg: 'An error occured during post retrieval'
        })

        return res.status(200).json({
            post
        })

    } catch (error) {
        console.log({ message: error.message });
        res.status(500).json({
            success: false,
            msg: 'An error occurred.',
        });
    }
}

export const getAllPosts = async (req, res) => {
    connect_database();

    try {
        const allPosts = await Post.find({}).populate('by');
        if (!allPosts) throw new Error('An error occurred.');

        const sortedPosts = allPosts.sort((a, b) => {
            const epochA = Date.parse(a.createdAt);
            const epochB = Date.parse(b.createdAt);
            return epochB - epochA;
        });

        const formattedPosts = sortedPosts.map((post) => {
            const createdAt = new Date(post.createdAt);
            const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getFullYear()}`;
            const formattedTime = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;
            return {
                ...post.toObject(),
                time: `${formattedDate} ${formattedTime}`,
            };
        });
        res.status(200).json({
            success: true,
            posts:formattedPosts,
        });
    } catch (error) {
        console.log({ message: error.message , error});
        res.status(500).json({
            success: false,
            msg: 'An error occurred.',
        });
    }
};

export const newComment = async (req, res) => {
    try {
        const { by, caption, photos, postId } = req.body;

        console.log('Images from New Comment creation:', photos);

        const newComment = new Comment({
            by,
            caption,
            photos,
        });

        console.log({newComment, by})

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(500).json({
                success: false,
                msg: 'Post not found.',
            });
        }

        const commentResponse = await newComment.save();
        if (!commentResponse) {
            return res.status(500).json({
                success: false,
                msg: 'An error occurred while saving the comment.',
            });
        }

        post.comments.push(commentResponse._id);
        const updatedPost = await post.save();
        if (!updatedPost) {
            return res.status(500).json({
                success: false,
                msg: 'An error occurred while updating the post.',
            });
        }

        const [post_, comment_] = await Promise.all([
          Post.findById(postId)
            .populate('by')
            .populate({
              path: 'comments',
              populate: [
                { path: 'by' },
                {
                  path: 'comments',
                  populate: { path: 'by' }, // Nested population
                },
              ],
            })
            .populate('tags'),
          Comment.findById(commentResponse._id).populate('by'),
        ]);



        if (!comment_ || !post_) {
            return res.status(500).json({
                success: false,
                msg: 'There was an error while fetching the post and comment.',
            });
        }

        console.log({post_})

        return res.status(200).json({
            success: true,
            msg: 'Comment created successfully.',
            post: post_,
            comment: comment_,
        });
    } catch (error) {
        console.error({ Message: error.message, error });
        return res.status(500).json({
            success: false,
            msg: 'There was an error while posting the comment.',
        });
    }
};


export const newPost = async (req, res) => {
    connect_database();
    try {
        const { by, caption, photos } = req.body;
        console.log('Images from New post creation : ', photos);

        const newPost = new Post({
            by,
            caption,
            photos,
        });

        const user = await User.findById(by)
        if (!user) {
            throw new Error('User not found.');
        }

        const postResponse = await newPost.save();
        if (!postResponse) {
            throw new Error('An error occurred while saving the post.');
        }

        user.posts.push(postResponse._id);
        const updatedUser = await user.save();
        if (!updatedUser) {
            throw new Error('An error occurred while saving the user.');
        }

        const [post_, user_] = await Promise.all([
            Post.findById(postResponse._id).populate('by comments'),
            User.findById(updatedUser._id).populate('posts sentRequests recvRequests connections')
        ])

        if (!user_ || !post_) return res.status(500).json({
            msg: 'There was an error!'
        })

        return res.status(200).json({
            success: true,
            msg: 'Post created successfully.',
            post: post_,
            user: user_,
        });
    } catch (error) {
        console.log({ Message: error.message, error });
        return res.status(500).json({
            success: false,
            msg: 'There was an error while posting.',
        });
    }
};