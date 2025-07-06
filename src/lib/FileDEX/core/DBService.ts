"use client";

export class DBService {
  constructor(
    private dbName: string,
    private version: number,
    private upgrade: (db: IDBDatabase, oldVersion: number) => void
  ) {}

  private dbPromise: Promise<IDBDatabase> = this.openDB();

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (e) => {
        const db = req.result;
        this.upgrade(db, (e as IDBVersionChangeEvent).oldVersion);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async withStore<T>(
    storeName: string,
    mode: IDBTransactionMode,
    cb: (store: IDBObjectStore) => IDBRequest | Promise<T>
  ): Promise<T> {
    const db = await this.dbPromise;
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction([storeName], mode);
      const store = tx.objectStore(storeName);
      const result = cb(store);

      if (result instanceof IDBRequest) {
        result.onsuccess = () => {
          tx.oncomplete = () => resolve(result.result as T);
          tx.onerror = () => reject(tx.error);
        };
        result.onerror = () => reject(result.error);
      } else {
        Promise.resolve(result)
          .then((val) => {
            tx.oncomplete = () => resolve(val);
            tx.onerror = () => reject(tx.error);
          })
          .catch(reject);
      }
    });
  }

  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    return this.withStore(storeName, "readonly", (store) =>
      store.get(key)
    ) as Promise<T>;
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    return this.withStore(storeName, "readonly", (store) =>
      store.getAll()
    ) as Promise<T[]>;
  }
}
