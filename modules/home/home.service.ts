import { ulid } from "jsr:@std/ulid/ulid";
import { kv } from "@app/utils/db.ts";

interface PostInput {
  content: string;
  author: string;
}

interface Post {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  commentCount?: number;
}

export async function createPost(input: PostInput): Promise<Post> {
  const id = ulid();
  const post: Post = {
    id,
    content: input.content,
    timestamp: new Date().toISOString(),
    author: input.author,
  };

  const primaryKey = ["posts", id];
  console.log("Creating post with ID:", id);

  const atomic = kv.atomic()
    .check({ key: primaryKey, versionstamp: null })
    .set(primaryKey, post);

  const res = await atomic.commit();
  console.log("Post creation result:", res);
  if (!res.ok) throw new Error("Failed to create post");

  return post;
}

export async function getPosts(limit = 20): Promise<Post[]> {
  console.log("Fetching posts");

  // Get all posts
  const postsResults: Post[] = [];
  const iterator = kv.list<Post>({ prefix: ["posts"] });

  for await (const entry of iterator) {
    postsResults.push(entry.value);
  }

  // Get comment counts for each post
  const commentCounts = new Map<string, number>();
  const commentsIterator = kv.list<Comment>({ prefix: ["comments"] });

  for await (const entry of commentsIterator) {
    const postId = entry.value.postId;
    commentCounts.set(postId, (commentCounts.get(postId) || 0) + 1);
  }

  // Add comment counts to posts
  const postsWithComments = postsResults.map((post) => ({
    ...post,
    commentCount: commentCounts.get(post.id) || 0,
  }));

  // Sort posts by timestamp (newest first)
  const posts = postsWithComments
    .sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);

  console.log(`Retrieved ${posts.length} posts`);
  return posts;
}

export async function getPostById(id: string): Promise<Post | null> {
  console.log("Fetching post with ID:", id);

  try {
    // Use the correct key structure for your KV database
    const primaryKey = ["posts", id];

    const result = await kv.get<Post>(primaryKey);
    if (!result.value) {
      console.log("Post not found with ID:", id);
      return null;
    }

    return result.value;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function deletePostById(id: string): Promise<boolean> {
  const primaryKey = ["posts", id];
  console.log("Deleting post with ID:", id);

  // First check if the post exists
  const existingPost = await kv.get<Post>(primaryKey);
  if (!existingPost.value) {
    console.log("Post not found with ID:", id);
    return false;
  }

  try {
    // Delete the post
    await kv.delete(primaryKey);

    // Verify the deletion was successful
    const checkAfterDelete = await kv.get<Post>(primaryKey);
    if (checkAfterDelete.value) {
      console.log("Post still exists after deletion attempt");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

// Comment interface
interface CommentInput {
  content: string;
  postId: string;
  author: string;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  timestamp: string;
  author: string;
}

// Create a new comment
export async function createComment(input: CommentInput): Promise<Comment> {
  const id = ulid();
  const comment: Comment = {
    id,
    content: input.content,
    postId: input.postId,
    timestamp: new Date().toISOString(),
    author: input.author,
  };

  const primaryKey = ["comments", id];
  console.log("Creating comment with ID:", id);

  const atomic = kv.atomic()
    .check({ key: primaryKey, versionstamp: null })
    .set(primaryKey, comment);

  const res = await atomic.commit();
  console.log("Comment creation result:", res);
  if (!res.ok) throw new Error("Failed to create comment");

  return comment;
}

// Get comments for a specific post
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  console.log("Fetching comments for post:", postId);
  const results: Comment[] = [];

  const iterator = kv.list<Comment>({ prefix: ["comments"] });

  for await (const entry of iterator) {
    if (entry.value.postId === postId) {
      results.push(entry.value);
    }
  }

  // Sort comments by timestamp (newest first)
  const comments = results.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  console.log(`Retrieved ${comments.length} comments for post ${postId}`);
  return comments;
}
