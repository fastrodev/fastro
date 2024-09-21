// deno-lint-ignore-file no-explicit-any
import { Octokit } from "npm:@octokit/rest";

type StoreOptions = {
    token?: string;
    owner: string;
    repo: string;
    path: string;
    branch?: string;
} | null;

export class Store<K extends string | number | symbol, V> {
    private map: Map<K, { value: V; expiry?: number }>;
    private options: StoreOptions;
    private intervalId: number | null = null;
    private isCommitting: boolean = false;

    constructor(options: StoreOptions = null) {
        this.map = new Map<K, { value: V; expiry?: number }>();
        this.options = options;
        // this.init();
    }

    /**
     * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
     * @param key
     * @param value
     * @param ttl
     */
    set(key: K, value: V, ttl?: number) {
        const expiry = ttl ? Date.now() + ttl : undefined;
        this.map.set(key, { value, expiry });
        return this;
    }

    /**
     * @param key
     * @returns boolean indicating whether an element with the specified key exists or not.
     */
    check(key: K) {
        if (this.map.has(key)) {
            throw new Error(`Key ${String(key)} is already used`);
        }

        return this;
    }

    /**
     * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
     * @returns - Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
     */
    async get(key: K) {
        await this.getMapFromRepo();
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

    /**
     * @param key
     * @returns boolean indicating whether an element with the specified key exists or not.
     */
    async has(key: K) {
        await this.getMapFromRepo();
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

    /**
     * @param key
     * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
     */
    delete(key: K): boolean {
        return this.map.delete(key);
    }

    clear(): void {
        this.map.clear();
    }

    /**
     * @returns the number of elements in the Map.
     */
    size(): number {
        this.cleanUpExpiredEntries();
        return this.map.size;
    }

    /**
     * @returns an iterable of key, value pairs for every entry in the map.
     */
    entries() {
        this.cleanUpExpiredEntries();
        return this.map.entries();
    }

    /**
     * @returns an iterable of values in the map
     */
    values() {
        this.cleanUpExpiredEntries();
        return this.map.values();
    }

    /**
     * @returns an iterable of keys in the map
     */
    keys() {
        this.cleanUpExpiredEntries();
        return this.map.keys();
    }

    /**
     * Executes a provided function once per each key/value pair in the Map, in insertion order.
     * @param callback
     */
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
        if (!this.options) throw new Error("Options are needed to commit");
        this.isCommitting = true;
        this.cleanUpExpiredEntries();
        try {
            return await this.saveToGitHub(
                {
                    token: this.options.token,
                    owner: this.options.owner,
                    repo: this.options.repo,
                    path: this.options.path,
                    branch: this.options.branch,
                },
            );
        } finally {
            this.isCommitting = false;
        }
    }

    /**
     * Delete file from repository
     */
    async destroy() {
        if (!this.options) throw new Error("Options are needed to destroy.");
        if (this.intervalId) clearInterval(this.intervalId);
        this.map.clear();
        return await deleteGithubFile({
            token: this.options.token,
            owner: this.options.owner,
            repo: this.options.repo,
            path: this.options.path,
            branch: this.options.branch,
        });
    }

    /**
     * Save the map to the repository
     * @param interval
     * @returns intervalId
     */
    async sync(interval: number = 5000) {
        if (this.intervalId) clearInterval(this.intervalId);
        if (await this.getMapFromRepo()) {
            this.intervalId = setInterval(async () => {
                await this.getMapFromRepo();
                if (this.map.size === 0) return;
                if (!this.options) {
                    throw new Error("Options are needed to sync");
                }
                await this.saveToGitHub({
                    token: this.options.token,
                    owner: this.options.owner,
                    repo: this.options.repo,
                    path: this.options.path,
                    branch: this.options.branch,
                });
            }, interval);
        }
        return this.intervalId;
    }

    private async getMapFromRepo() {
        if (this.map.size === 0 && this.options) {
            const map = await getMap<K, V>({
                token: this.options.token,
                owner: this.options.owner,
                repo: this.options.repo,
                path: this.options.path,
                branch: this.options.branch,
            });
            if (!map) return false;
            this.map = map;
        }

        return true;
    }

    private async saveToGitHub(options: StoreOptions) {
        try {
            if (!options || !options.token) {
                throw new Error("GITHUB_TOKEN is needed");
            }
            const opt = {
                token: options.token,
                owner: options.owner,
                repo: options.repo,
                path: options.path,
                branch: options.branch,
                content: JSON.stringify(mapToRecord(this.map)),
            };
            return await uploadFileToGitHub(opt);
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

async function getSHA(options: StoreOptions): Promise<string | undefined> {
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

async function uploadFileToGitHub(
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

async function getMap<K extends string | number | symbol, V>(
    options: StoreOptions,
) {
    if (!options || !options.token) throw new Error("GITHUB_TOKEN is needed");
    const rr = await getFileFromGithub(options) as any;
    if (!rr) return;
    const data = atob(rr.content);
    return recordToMap<K, V>(JSON.parse(data));
}

async function getFileFromGithub(options: StoreOptions) {
    if (!options || !options.token) throw new Error("GITHUB_TOKEN is needed");
    const octokit = new Octokit({ auth: options.token });
    try {
        const res = await octokit.repos.getContent({
            owner: options.owner,
            repo: options.repo,
            path: options.path,
            ref: options.branch,
        });
        return res.data;
    } catch {
        return undefined;
    }
}

async function deleteGithubFile(options: StoreOptions) {
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
