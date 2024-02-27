const db = require('./db');
const util = require('util');

const queryPromise = util.promisify(db.query).bind(db);

const addData = async (nama, status) => {
  const sql = 'INSERT INTO Test01 (Nama, Status, Created) VALUES (?, ?, NOW())';
  return queryPromise(sql, [nama, status]);
};

const getDetail = async (id) => {
  const sql = 'SELECT * FROM Test01 WHERE Id = ?';
  return queryPromise(sql, [id]);
};

const getList = async (limit, offset) => {
  const sql = 'SELECT * FROM Test01 LIMIT ? OFFSET ?';
  return queryPromise(sql, [limit, offset]);
};

const updateData = async (Name, Status, Id) => {
  const sql =
    'UPDATE Test01 SET Nama = ?, Status = ?, Updated = NOW() WHERE Id = ?';
  return queryPromise(sql, [Name, Status, Id]);
};

const deleteData = async (Id) => {
  const sql = 'DELETE FROM Test01 WHERE Id = ?';
  return queryPromise(sql, [Id]);
};

module.exports = {
  addData,
  getDetail,
  getList,
  updateData,
  deleteData
};
