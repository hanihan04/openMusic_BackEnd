const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }
 
  async addCollaboration(playlistId, userId) {
    await this.verifyExistingUser(userId);
    const id = `collab-${nanoid(16)}`; 
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    }; 
    const result = await this._pool.query(query); 
    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal ditambahkan!');
    } 
    return result.rows[0].id;
  }
 
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlistid = $1 AND userid = $2 RETURNING id',
      values: [playlistId, userId],
    }; 
    const result = await this._pool.query(query); 
    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus!');
    }
  }
 
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlistid = $1 AND userid = $2',
      values: [playlistId, userId],
    }; 
    const result = await this._pool.query(query); 
    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi!');
    }
  }

  async verifyExistingUser(userId){
    const query = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount){
        throw new NotFoundError('User tidak ditemukan!');
    }
}
}
 
module.exports = CollaborationsService;