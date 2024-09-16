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
    private map: Map<K, { value: V; expiry?: number }>;
    private options: StoreOptions;
    private saveIntervalId: number | null = null;
    private isCommitting: boolean = false;

    constructor(options: StoreOptions = null) {
        this.map = new Map<K, { value: V; expiry?: number }>();
        this.options = options;
    }

    set(key: K, value: V, ttl?: number): void {
        const expiry = ttl ? Date.now() + ttl : undefined;
        this.map.set(key, { value, expiry });
    }

    async refresh() {
        if (this.map.size === 0 && this.options) {
            const map = await getMap<K, V>({
                token: this.options.token,
                owner: this.options.owner,
                repo: this.options.repo,
                path: this.options.path,
                branch: this.options.branch,
            });
            if (!map) return;
            this.map = map;
        }
    }

    async get(key: K): Promise<V | undefined> {
        await this.refresh();
        const entry = this.map.get(key);
        if (entry) {
            if (entry.expiry === undefined || Date.now() < entry.expiry) {
                return entry.value;
            } else {
                this.map.delete(key);
            }
        }
        return undefined;
    }

    async has(key: K): Promise<boolean> {
        await this.refresh();
        const entry = this.map.get(key);
        if (entry) {
            if (entry.expiry === undefined || Date.now() < entry.expiry) {
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

    /**
     * Save to github
     */
    async commit() {
        if (this.isCommitting) {
            throw new Error("Commit in progress, please wait.");
        }

        this.isCommitting = true;
        try {
            this.cleanUpExpiredEntries();
            if (!this.options) throw new Error("Options is needed.");
            const x = await this.saveToGitHub(
                {
                    token: this.options.token,
                    owner: this.options.owner,
                    repo: this.options.repo,
                    path: this.options.path,
                    branch: this.options.branch,
                },
            );
            return x;
        } finally {
            this.isCommitting = false;
        }
    }

    async destroy() {
        this.map.clear();
        if (!this.options) throw new Error("Options is needed.");
        return await deleteGithubFile({
            token: this.options.token,
            repoOwner: this.options.owner,
            repoName: this.options.repo,
            filePath: this.options.path,
            branch: this.options.branch,
        });
    }

    startAutoSave(interval: number): void {
        if (this.saveIntervalId) {
            clearInterval(this.saveIntervalId);
        }

        this.saveIntervalId = setInterval(() => {
            if (!this.options || this.map.size === 0) return;
            return this.saveToGitHub({
                token: this.options.token,
                owner: this.options.owner,
                repo: this.options.repo,
                path: this.options.path,
                branch: this.options.branch,
            });
        }, interval);
    }

    private async saveToGitHub(
        options: {
            token: string;
            owner: string;
            repo: string;
            path: string;
            branch?: string;
        },
    ) {
        try {
            if (this.options) {
                const record = mapToRecord(this.map);
                const data = JSON.stringify(record);
                return await uploadFileToGitHub(
                    {
                        token: options.token,
                        repoOwner: options.owner,
                        repoName: options.repo,
                        filePath: options.path,
                        fileContent: data,
                        branch: options.branch,
                    },
                );
            }
        } catch (error) {
            throw error;
        }
    }

    private cleanUpExpiredEntries(): void {
        for (const [key, entry] of this.map.entries()) {
            if (entry.expiry !== undefined && Date.now() >= entry.expiry) {
                this.map.delete(key);
            }
        }
    }
}

function recordToMap<K extends string | number | symbol, V>(
    record: Record<K, { value: V; expiry: number }>,
): Map<K, { value: V; expiry?: number }> {
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
    options: {
        token: string;
        repoOwner: string;
        repoName: string;
        filePath: string;
        branch?: string;
    },
): Promise<string | undefined> {
    const octokit = new Octokit({ auth: options.token });
    try {
        const response = await octokit.repos.getContent({
            owner: options.repoOwner,
            repo: options.repoName,
            path: options.filePath,
            ref: options.branch,
        }) as any;

        return response.data.sha;
    } catch (error) {
        throw error;
    }
}

async function uploadFileToGitHub(
    options: {
        token: string;
        repoOwner: string;
        repoName: string;
        filePath: string;
        fileContent: string;
        branch?: string;
    },
) {
    const octokit = new Octokit({ auth: options.token });
    try {
        const res = await getFileFromGithub(
            {
                token: options.token,
                repoOwner: options.repoOwner,
                repoName: options.repoName,
                filePath: options.filePath,
                branch: options.branch,
            },
        ) as any;

        const sha = res
            ? await getSHA({
                token: options.token,
                repoOwner: options.repoOwner,
                repoName: options.repoName,
                filePath: options.filePath,
                branch: options.branch,
            })
            : undefined;

        const message = res
            ? `Update ${options.filePath}`
            : `Create ${options.filePath}`;
        return await octokit.repos.createOrUpdateFileContents({
            owner: options.repoOwner,
            repo: options.repoName,
            path: options.filePath,
            message,
            content: btoa(options.fileContent),
            sha,
            branch: options.branch,
        });
    } catch (error) {
        throw error;
    }
}

async function getMap<K extends string | number | symbol, V>(
    options: {
        token: string;
        owner: string;
        repo: string;
        path: string;
        branch?: string;
    },
) {
    const rr = await getFileFromGithub(
        {
            token: options.token,
            repoOwner: options.owner,
            repoName: options.repo,
            filePath: options.path,
            branch: options.branch,
        },
    ) as any;
    if (!rr) return;
    const data = atob(rr.content);
    return recordToMap<K, V>(JSON.parse(data));
}

async function getFileFromGithub(options: {
    token: string;
    repoOwner: string;
    repoName: string;
    filePath: string;
    branch?: string;
}) {
    const octokit = new Octokit({ auth: options.token });
    try {
        const res = await octokit.repos.getContent({
            owner: options.repoOwner,
            repo: options.repoName,
            path: options.filePath,
            ref: options.branch,
        });
        return res.data;
    } catch {
        return undefined;
    }
}

async function deleteGithubFile(
    options: {
        token: string;
        repoOwner: string;
        repoName: string;
        filePath: string;
        branch?: string;
    },
) {
    const octokit = new Octokit({ auth: options.token });
    try {
        const sha = await getSHA({
            token: options.token,
            repoOwner: options.repoOwner,
            repoName: options.repoName,
            filePath: options.filePath,
            branch: options.branch,
        });
        if (!sha) throw new Error("SHA is needed");
        const res = await octokit.repos.deleteFile({
            owner: options.repoOwner,
            repo: options.repoName,
            path: options.filePath,
            sha,
            branch: options.branch,
            message: `Delete ${options.filePath}`,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}
