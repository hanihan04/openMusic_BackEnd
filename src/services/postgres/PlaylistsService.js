const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelPlaylists, mapDBToModelPlaylistAct, mapDBToModelSongs } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addPlaylist({name, owner}){
        await this.verifyExistingPlaylistName(name);
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        }; 
        const result = await this._pool.query(query); 
        if (!result.rows[0].id) {
          throw new InvariantError('Playlist gagal ditambahkan!');
        } 
        return result.rows[0].id;
    }

    async getPlaylists(owner){
        const query = {
            text: `SELECT p.id, p.name, u.username FROM playlists p INNER JOIN users u ON u.id = p.owner LEFT JOIN collaborations c ON c.playlistid = p.id WHERE p.owner = $1 OR c.userid = $1`,
            values: [owner],
          };
          const result = await this._pool.query(query);
          return result.rows.map(mapDBToModelPlaylists);
    }

    async deletePlaylistById(id, owner){
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id, owner',
            values: [id, owner],
        };       
        const result = await this._pool.query(query);       
        if (!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus! Id tidak ditemukan.');
        }
    }

    async addSongToPlaylist(playlistId, songId){
        await this.verifyExistingSong(songId);
        await this.verifyExistingSongInPlaylist(songId);
        const id = `pl_songs-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],            
        }; 
        const result = await this._pool.query(query); 
        if (!result.rows[0].id) {
          throw new InvariantError('Lagu gagal ditambahkan ke Playlist!');
        } 
        return result.rows[0].id;
    }

    async getPlaylistById(id){
        const query = {
            text: `SELECT p.id, p.name, u.username FROM playlists p
            INNER JOIN users u ON u.id = p.owner
            WHERE p.id = $1`,
            values: [id],
        }
        const result = await this._pool.query(query); 
        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan!');
        }
        return result.rows.map(mapDBToModelPlaylists)[0];
    }    
    async getSongsInPlaylist(id){
        const query = {
            text: `SELECT s.id, s.title, s.performer FROM songs s
            LEFT JOIN playlist_songs pls ON pls.songid = s.id
            WHERE pls.playlistid = $1`,
            values: [id],
        };
        const result = await this._pool.query(query);
        return result.rows.map(mapDBToModelSongs);
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlistid = $1 AND songid = $2 RETURNING id',
            values: [playlistId, songId],
        };       
        const result = await this._pool.query(query);       
        if (!result.rowCount) {
            throw new NotFoundError('Lagu gagal dihapus dari Playlist! Id tidak ditemukan.');
        }
    }

    async postPlaylistAct(playlistId, songId, userId, action){
        const id = `pl_song_act-${nanoid(16)}`;
        const time = new Date().toISOString();
        const query ={
            text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, playlistId, songId, userId, action, time],
        };
        const result = await this._pool.query(query);
        if(!result.rowCount){
            throw new InvariantError('Aktivitas Playlist gagal ditambahkan!');
        }
        return result.rows[0].id;
    }

    async getPlaylistAct(playlistId){
        const query ={
            text: `SELECT u.username, s.title, plsong_act.action, plsong_act.time
            FROM playlist_song_activities plsong_act
            INNER JOIN users u ON u.id = plsong_act.userid
            RIGHT JOIN songs s ON s.id = plsong_act.songid
            WHERE plsong_act.playlistid = $1`,
            values: [playlistId],
        };
        const result = await this._pool.query(query);
        return result.rows.map(mapDBToModelPlaylistAct);
    }
    
    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan!');
        }
        const playlist = result.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses playlist ini!');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }

    async verifyExistingSong(songId){
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount){
            throw new NotFoundError('Lagu tidak ditemukan!');
        }
    }

    async verifyExistingSongInPlaylist(songId){
        const query = {
            text: 'SELECT * FROM playlist_songs WHERE songId = $1',
            values: [songId],
        };
        const result = await this._pool.query(query);
        if (result.rowCount > 0){
            throw new InvariantError('Lagu gagal ditambahkan! Lagu sudah terdapat di dalam playlist.');
        }
    }

    async verifyExistingPlaylistName(name){
        const query = {
            text: 'SELECT * FROM playlists WHERE name = $1',
            values: [name],
        };
        const result = await this._pool.query(query);
        if (result.rowCount > 0){
            throw new InvariantError('Playlist gagal dibuat! playlist dgn nama tersebut sudah ada.');
        }
    }
}

module.exports = PlaylistsService;
