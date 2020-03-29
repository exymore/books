const DB_NAME = 'bookdb';
const STORAGE_NAME = 'books';
const DB_VERSION = 1;
let DB;

export default {
  async getDb () {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB)
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = e => {
        console.log('Error opening db', e);
        reject('Error')
      };
      request.onsuccess = e => {
        DB = e.target.result;
        resolve(DB)
      };
      request.onupgradeneeded = e => {
        let db = e.target.result;
        db.createObjectStore(STORAGE_NAME, { autoIncrement: true, keyPath: 'id' });
      }
    })
  },
  async delete (book) {
    const db = await this.getDb();
    return new Promise(resolve => {
      const trans = db.transaction([STORAGE_NAME], 'readwrite');
      trans.oncomplete = () => {
        resolve()
      };
      const store = trans.objectStore(STORAGE_NAME);
      store.delete(book.id)
    })
  },
  async getAll () {
    let db = await this.getDb();
    return new Promise(resolve => {
      let trans = db.transaction([STORAGE_NAME], 'readonly');
      trans.oncomplete = () => {
        resolve(books)
      };
      const store = trans.objectStore(STORAGE_NAME);
      const books = [];
      store.openCursor().onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
          books.push(cursor.value);
          cursor.continue()
        }
      }
    })
  },
  async getByKey (key) {
    let db = await this.getDb();
    return new Promise(resolve => {
      let trans = db.transaction([STORAGE_NAME], 'readonly');
      trans.oncomplete = () => {
        resolve(book.result)
      };
      let store = trans.objectStore(STORAGE_NAME);
      let book = store.get(key)
    })
  },
  async save (book) {
    let db = await this.getDb();
    return new Promise(resolve => {
      let trans = db.transaction([STORAGE_NAME], 'readwrite');
      trans.oncomplete = () => {
        resolve()
      };
      let store = trans.objectStore(STORAGE_NAME);
      store.put(book)
    })
  },
}
