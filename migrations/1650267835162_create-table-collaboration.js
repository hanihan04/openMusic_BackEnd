/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  /*
    Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan user_id.
    Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint('collaborations', 'unique_playlistid_and_userid', 'UNIQUE(playlistid, userid)');
  pgm.addConstraint('collaborations', 'fk_collaborations.playlistid_playlists.id', 'FOREIGN KEY(playlistid) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.userid_users.id', 'FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'unique_playlistid_and_userid');
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlistid_playlists.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.userid_users.id');
  pgm.dropTable('collaborations');
};
