const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query1 = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const query2 = {
      text: 'SELECT s.id, s.title, s.performer FROM playlist_songs pls INNER JOIN songs s ON pls.songid = s.id WHERE pls.playlistid = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query1);
    result.rows[0].songs=(await this._pool.query(query2)).rows;
    const playlist = result.rows[0];
    return playlist;
  }
}

module.exports = PlaylistsService;