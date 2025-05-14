export interface TabsStorage{
    saveHistory(history: History): VPromise
    getHistory(): Promise<History>
}