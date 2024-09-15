// deno-lint-ignore-file no-explicit-any
import { Octokit } from "npm:@octokit/rest";

type StoreOptions = {
    owner: string;
    repo: string;
    path: string;
    token: string;
    branch?: string;
} | null;

export class Store<K extends string | number | symbol, V> {
    private map: Map<K, { value: V; expiry: number }>;
    private defaultTTL: number;
    private options: StoreOptions;
    private saveIntervalId: number | null = null;

    constructor(defaultTTL: number = 60000, options: StoreOptions = null) {
        this.map = new Map<K, { value: V; expiry: number }>();
        this.defaultTTL = defaultTTL;
        this.options = options;
    }

    set(key: K, value: V, ttl?: number): void {
        const expiry = Date.now() + (ttl ?? this.defaultTTL);
        this.map.set(key, { value, expiry });
    }

    async get(key: K): Promise<V | undefined> {
        if (this.map.size === 0 && this.options) {
            const rr = await getFileFromGithub(
                this.options.token,
                this.options.owner,
                this.options.repo,
                this.options.path,
                this.options.branch,
            ) as any;
            if (rr) {
                const data = atob(rr.content);
                this.map = recordToMap(JSON.parse(data));
            }
        }

        const entry = this.map.get(key);
        if (entry) {
            if (Date.now() < entry.expiry) {
                return entry.value;
            } else {
                this.map.delete(key);
            }
        }
        return undefined;
    }

    has(key: K): boolean {
        const entry = this.map.get(key);
        if (entry) {
            if (Date.now() < entry.expiry) {
                return true;
            } else {
                this.map.delete(key);
            }
        }
        return false;
    }

    delete(key: K): boolean {
        return this.map.delete(key);
    }

    clear(): void {
        this.map.clear();
    }

    size(): number {
        this.cleanUpExpiredEntries();
        return this.map.size;
    }

    entries() {
        this.cleanUpExpiredEntries();
        return this.map.entries();
    }

    values() {
        this.cleanUpExpiredEntries();
        return this.map.values();
    }

    keys() {
        this.cleanUpExpiredEntries();
        return this.map.keys();
    }

    forEach(callback: (value: V, key: K) => void): void {
        this.cleanUpExpiredEntries();
        this.map.forEach((entry, key) => {
            callback(entry.value, key);
        });
    }

    async commit() {
        this.cleanUpExpiredEntries();
        if (!this.options) throw new Error("Options is needed.");
        return await this.saveToGitHub(
            this.options.token,
            this.options.owner,
            this.options.repo,
            this.options.path,
        );
    }

    async destroy() {
        this.map.clear();
        if (!this.options) throw new Error("Options is needed.");
        return await deleteGithubFile(
            this.options.token,
            this.options.owner,
            this.options.repo,
            this.options.path,
            this.options.branch,
        );
    }

    startAutoSave(interval: number): void {
        if (this.saveIntervalId) {
            clearInterval(this.saveIntervalId);
        }

        this.saveIntervalId = setInterval(() => {
            if (!this.options) return;
            return this.saveToGitHub(
                this.options.token,
                this.options.owner,
                this.options.repo,
                this.options.path,
            );
        }, interval);
    }

    stopAutoSave(): void {
        if (this.saveIntervalId) {
            clearInterval(this.saveIntervalId);
            this.saveIntervalId = null;
        }
    }

    private async saveToGitHub(
        token: string,
        owner: string,
        repo: string,
        path: string,
        branch?: string,
    ) {
        try {
            if (this.options) {
                const record = mapToRecord(this.map);
                const data = JSON.stringify(record);
                return await uploadFileToGitHub(
                    token,
                    owner,
                    repo,
                    path,
                    data,
                    branch,
                );
            }
        } catch (error) {
            throw error;
        }
    }

    private cleanUpExpiredEntries(): void {
        for (const [key, entry] of this.map.entries()) {
            if (Date.now() >= entry.expiry) {
                this.map.delete(key);
            }
        }
    }
}

function recordToMap<K extends string | number | symbol, V>(
    record: Record<K, { value: V; expiry: number }>,
): Map<K, { value: V; expiry: number }> {
    const map = new Map<K, { value: V; expiry: number }>();

    Object.entries(record).forEach(([key, value]) => {
        map.set(key as K, value as { value: V; expiry: number });
    });

    return map;
}

function mapToRecord<K extends string | number | symbol, V>(
    map: Map<K, V>,
): Record<K, V> {
    return Object.fromEntries(map) as Record<K, V>;
}

async function getSHA(
    token: string,
    repoOwner: string,
    repoName: string,
    filePath: string,
    branch?: string,
): Promise<string | undefined> {
    const octokit = new Octokit({ auth: token });

    try {
        const response = await octokit.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            branch,
        }) as any;

        return response.data.sha;
    } catch (error) {
        throw error;
    }
}

async function uploadFileToGitHub(
    token: string,
    repoOwner: string,
    repoName: string,
    filePath: string,
    fileContent: string,
    branch?: string,
) {
    const octokit = new Octokit({ auth: token });
    try {
        const res = await getFileFromGithub(
            token,
            repoOwner,
            repoName,
            filePath,
            branch,
        ) as any;

        const sha = res
            ? await getSHA(token, repoOwner, repoName, filePath)
            : undefined;

        const message = res ? `Update ${filePath}.` : `Create ${filePath}.`;
        return await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message,
            content: btoa(fileContent),
            sha,
            branch,
        });
    } catch (error) {
        throw error;
    }
}

async function getFileFromGithub(
    token: string,
    repoOwner: string,
    repoName: string,
    filePath: string,
    branch?: string,
) {
    const octokit = new Octokit({ auth: token });
    try {
        const res = await octokit.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            branch,
        });
        return res.data;
    } catch {
        return undefined;
    }
}

async function deleteGithubFile(
    token: string,
    repoOwner: string,
    repoName: string,
    filePath: string,
    branch?: string,
) {
    const octokit = new Octokit({ auth: token });
    try {
        const sha = await getSHA(token, repoOwner, repoName, filePath);
        if (!sha) throw new Error("SHA is needed");
        const res = await octokit.repos.deleteFile({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            sha,
            branch,
            message: `Delete ${filePath}`,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}
