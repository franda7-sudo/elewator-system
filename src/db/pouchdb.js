import PouchDB from 'pouchdb-browser';

const localDB = new PouchDB('elewator_db', {
  auto_compaction: true
});

export default localDB;
