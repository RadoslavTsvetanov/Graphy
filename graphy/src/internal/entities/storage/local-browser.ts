import type { IStorage, StorageOptions } from './interface';
import { Optionable } from '@custom-express/better-standard-library';

export class LocalBrowserStorage implements IStorage {
    private readonly prefix: string;

    constructor(prefix: string = 'graphy_') {
        this.prefix = prefix;
    }

    private getFullKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    async save(key: string, value: any, options?: StorageOptions): Promise<string> {
        try {
            const fullKey = this.getFullKey(key);
            const storageEntry = {
                value,
                metadata: options?.metadata,
                createdAt: Date.now(),
                expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : null
            };

            localStorage.setItem(fullKey, JSON.stringify(storageEntry));
            return fullKey;
        } catch (error) {
            console.error('Storage save error:', error);
            throw error;
        }
    }

    async get<T>(key: string): Promise<Optionable<T>> {
        try {
            const fullKey = this.getFullKey(key);
            const item = localStorage.getItem(fullKey);
            
            if (!item) return Optionable.none<T>();

            const storageEntry = JSON.parse(item);

            // Check for expiration
            if (storageEntry.expiresAt && Date.now() > storageEntry.expiresAt) {
                localStorage.removeItem(fullKey);
                return Optionable.none<T>();
            }

            return Optionable.some(storageEntry.value as T);
        } catch (error) {
            console.error('Storage get error:', error);
            return Optionable.none<T>();
        }
    }

    async delete(key: string): Promise<boolean> {
        try {
            const fullKey = this.getFullKey(key);
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Storage delete error:', error);
            return false;
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            const fullKey = this.getFullKey(key);
            const item = localStorage.getItem(fullKey);
            
            if (!item) return false;

            const storageEntry = JSON.parse(item);
            
            // Check for expiration
            if (storageEntry.expiresAt && Date.now() > storageEntry.expiresAt) {
                localStorage.removeItem(fullKey);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Storage has error:', error);
            return false;
        }
    }

    async clear(): Promise<boolean> {
        try {
            // Only remove keys with our prefix
            Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
}

export default LocalBrowserStorage;