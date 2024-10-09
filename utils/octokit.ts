// deno-lint-ignore-file
import { Octokit } from "npm:@octokit/rest";

export type StoreOptions = {
    token?: string;
    owner: string;
    repo: string;
    path: string;
    branch?: string;
} | null;

export function recordToMap<K extends string | number | symbol, V>(
    record: Record<K, { value: V; expiry: number }>,
): Map<K, { value: V; expiry?: number }> {
    const map = new Map<K, { value: V; expiry: number }>();

    Object.entries(record).forEach(([key, value]) => {
        const entry = value as { value: V; expiry: number };
        map.set(key as K, entry);
    });

    return map;
}

export function mapToRecord<K extends string | number | symbol, V>(
    map: Map<K, V>,
): Record<K, V> {
    return Object.fromEntries(map) as Record<K, V>;
}

export async function getSHA(
    options: StoreOptions,
): Promise<string | undefined> {
    if (!options || !options.token) throw new Error("GITHUB_TOKEN is needed");
    const octokit = new Octokit({ auth: options.token });
    try {
        const response = await octokit.repos.getContent({
            owner: options.owner,
            repo: options.repo,
            path: options.path,
            ref: options.branch,
        }) as any;

        return response.data.sha;
    } catch (error) {
        throw error;
    }
}

export async function uploadFileToGitHub(
    options: {
        token?: string;
        owner: string;
        repo: string;
        path: string;
        content: string;
        branch?: string;
    },
) {
    const octokit = new Octokit({ auth: options.token });
    try {
        const res = await getFileFromGithub(options);
        const sha = res ? await getSHA(options) : undefined;
        const message = res
            ? `Update ${options.path}`
            : `Create ${options.path}`;
        return await octokit.repos.createOrUpdateFileContents({
            owner: options.owner,
            repo: options.repo,
            path: options.path,
            message,
            content: btoa(options.content),
            sha,
            branch: options.branch,
        });
    } catch (error) {
        throw error;
    }
}

export async function getMap<K extends string | number | symbol, V>(
    options: StoreOptions,
) {
    if (!options || !options.token) return;
    const res = await getFileFromGithub(options) as any;
    // console.log("file", res);
    if (res) return recordToMap<K, V>(JSON.parse(res));
}

/**
 * Gets the contents of a file in a repository (1-100 MB)
 */
export async function getFileFromGithub(options: StoreOptions) {
    if (!options || !options.token) throw new Error("GITHUB_TOKEN is needed");
    const octokit = new Octokit({ auth: options.token });
    try {
        const res = await octokit.repos.getContent({
            owner: options.owner,
            repo: options.repo,
            path: options.path,
            ref: options.branch,
            mediaType: { format: "raw" },
        });
        // console.log("res2", res);
        return res.data;
    } catch {
        return undefined;
    }
}

export async function deleteGithubFile(options: StoreOptions) {
    if (!options || !options.token) throw new Error("GITHUB_TOKEN is needed");
    const octokit = new Octokit({ auth: options.token });
    try {
        const sha = await getSHA(options);
        if (!sha) throw new Error("SHA is needed");
        const res = await octokit.repos.deleteFile({
            owner: options.owner,
            repo: options.repo,
            path: options.path,
            sha,
            branch: options.branch,
            message: `Delete ${options.path}`,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}
