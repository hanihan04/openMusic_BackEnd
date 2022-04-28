/* eslint-disable camelcase */
exports.up = (pgm) => { 
  pgm.addConstraint('songs', 'fk_songs.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlistid_playlists.id', 'FOREIGN KEY(playlistid) REFERENCES playlists(id) ON DELETE CASCADE');
};
 
exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_album.id');
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlistid_playlists.id');
};

