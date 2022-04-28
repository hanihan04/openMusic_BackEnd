const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserLikesAlbumService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addLikeToAlbum({userId, albumId}){
        await this.verifyExistingAlbumById(albumId);        
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
            throw new NotFoundError('Like pada Album GAGAL dibatalkan! Id tidak ditemukan');
        }
        await this._cacheService.delete(`user_album_likes:${albumId}`);
    }    

    async getUsersLikeCount(albumId){
        try{
            const result = await this._cacheService.get(`user_album_likes: ${albumId}`);
            return{
                count: JSON.parce(result),
                source: 'cache',
            }
        } catch (error){
            const query = {
                text: 'SELECT * FROM user_album_likes WHERE albumid = $1',
                values: [albumId],
            };
            const result = await this._pool.query(query);
            await this._cacheService.set(`user_album_likes: ${albumId}`, JSON.stringify(result.rowCount));
            return {
                count: result.rowCount,
                source: 'db',
            }
        }
    }

    async verifyExistingAlbumById(albumId){
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [albumId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount){
            throw new NotFoundError('Album tidak ditemukan!');
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

}

module.exports = UserLikesAlbumService;