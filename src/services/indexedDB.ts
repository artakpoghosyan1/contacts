import { openDB, IDBPDatabase } from 'idb'

const DB_NAME = 'imageDatabase'
const STORE_NAME = 'images'

let dbPromise: Promise<IDBPDatabase> | null = null

export async function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' })
                }
            },
        });
    }
    return dbPromise
}

export async function saveImage(id: string, file: Blob) {
    const db = await getDB();
    await db.put(STORE_NAME, { id, file });

    return URL.createObjectURL(file);
}

export async function getImageUrl(id: string): Promise<string | null> {
    const db = await getDB();
    const record = await db.get(STORE_NAME, id);
    return record ? URL.createObjectURL(record.file) : null;
}

export async function deleteImage(id: string) {
    const db = await getDB();
    return db.delete(STORE_NAME, id);
}
