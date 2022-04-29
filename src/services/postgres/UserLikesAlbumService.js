const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserLikesAlbumService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addLikeToAlbum(userId, albumId){            
        const id = `albumLike-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        }; 
        const result = await this._pool.query(query); 
        if (!result.rows[0].id) {
            throw new InvariantError('Album GAGAL disukai! Id album tidak ditemukan.');
        }
        await this._cacheService.delete(`user_album_likes: ${albumId}`);
        return result.rows[0].id;
    }

    async deleteLikeFromAlbum(userId, albumId){
        const query = {
            text: 'DELETE FROM user_album_likes WHERE userid = $1 AND albumid = $2 RETURNING id',
            values: [userId, albumId],
        }; 
        const result = await this._pool.query(query); 
        if (!result.rowCount) {
            throw new InvariantError('Like pada Album GAGAL dibatalkan!');
        }
        await this._cacheService.delete(`user_album_likes: ${albumId}`);
    }    

    async getAllLikesCount(albumId){       
        try{
            const result = await this._cacheService.get(`user_album_likes: ${albumId}`);
            return { 
                count: JSON.parce(result),
                source: 'cache',
            };
        } catch (error){
            const result = await this._pool.query(`SELECT * FROM user_album_likes WHERE albumid = '${albumId}'`);
            await this._cacheService.set(`user_album_likes: ${albumId}`, JSON.stringify(result.rowCount));
            return {
                count: result.rowCount,
                source: 'db',
            };
        }
    }
    
    async verifyUserLikesAlbum(userId, albumId){
        const query = {
            text: 'SELECT * FROM user_album_likes WHERE userid = $1 AND albumid = $2',
            values: [userId, albumId],
        };
        const result = await this._pool.query(query);
        return result.rowCount;
    }

    async verifyExistingAlbumById(albumId){
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [albumId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Album tidak ditemukan.');
        }
    }

}

module.exports = UserLikesAlbumService;