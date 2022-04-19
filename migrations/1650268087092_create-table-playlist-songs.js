/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
 
  /*
    Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan song_id.
    Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint('playlist_songs', 'unique_playlistid_and_songid', 'UNIQUE(playlistid, songid)');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlistid_playlists.id', 'FOREIGN KEY(playlistid) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.songid_songs.id', 'FOREIGN KEY(songid) REFERENCES songs(id) ON DELETE CASCADE');
};
 
exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'unique_playlistid_and_songid');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlistid_playlists.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.songid_songs.id');
  pgm.dropTable('playlist_songs');
};