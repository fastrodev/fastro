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
  console.log("Fetching posts, limit:", limit);
  const iterator = kv.list<Post>({ prefix: ["posts"] }, { limit });

  // Collect all entries from the iterator
  const results: Post[] = [];
  for await (const entry of iterator) {
    results.push(entry.value);
  }

  // Sort posts by timestamp (newest first)
  const posts = results.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  console.log(`Retrieved ${posts.length} posts from database`);
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
