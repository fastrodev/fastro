import { uploadFileToGitHub } from "@app/utils/octokit.ts";
import { Store } from "@app/core/map/mod.ts";
import { ulid } from "jsr:@std/ulid/ulid";

export async function createMessage(
    options: { userId: string; content: string; title: string },
) {
    const store = new Store({
        // token: Deno.env.get("GITHUB_TOKEN"),
        // owner: Deno.env.get("MESSAGE_OWNER") || "fastrodev",
        // repo: Deno.env.get("MESSAGE_REPO") || "fastro",
        // branch: Deno.env.get("MESSAGE_BRANCH") || "store",
        // path: `modules/store/${options.userId}/message.json`,
        key: "message",
    });

    const postId = ulid();
    await store.set(postId, { title: options.title, postId }).commit();

    const r = await uploadFileToGitHub({
        token: Deno.env.get("GITHUB_TOKEN"),
        owner: Deno.env.get("MESSAGE_OWNER") || "fastrodev",
        repo: Deno.env.get("MESSAGE_REPO") || "fastro",
        branch: Deno.env.get("MESSAGE_BRANCH") || "store",
        path: `modules/store/${options.userId}/${postId}.md`,
        content: options.content,
    });

    if (r.status !== 201) return;
    return { postId, ...options };
}
