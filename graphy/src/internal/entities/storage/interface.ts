import type { Optionable } from "@custom-express/better-standard-library";

export interface IStorage {
    /**
     * Save a value to storage with an optional expiration time
     * @param key Unique identifier for the stored item
     * @param value Value to be stored
     * @param options Optional configuration for storage
     * @returns A unique identifier or confirmation of storage
     */
    save(key: string, value: any, options?: StorageOptions): Promise<string>;

    /**
     * Retrieve a value from storage
     * @param key Unique identifier for the stored item
     * @returns The stored value or null if not found
     */
    get<T>(key: string): Promise<Optionable<T>>;

    /**
     * Delete a specific item from storage
     * @param key Unique identifier for the stored item
     * @returns Boolean indicating successful deletion
     */
    delete(key: string): Promise<boolean>;

    /**
     * Check if a key exists in storage
     * @param key Unique identifier to check
     * @returns Boolean indicating key's existence
     */
    has(key: string): Promise<boolean>;

    /**
     * Clear all items from storage
     * @returns Boolean indicating successful clearing
     */
    clear(): Promise<boolean>;
}

/**
 * Optional configuration for storage operations
 */
export interface StorageOptions {
    /**
     * Expiration time in milliseconds
     * If not provided, item will not expire
     */
    expiresIn?: number;

    /**
     * Optional metadata associated with the stored item
     */
    metadata?: Record<string, any>;
}