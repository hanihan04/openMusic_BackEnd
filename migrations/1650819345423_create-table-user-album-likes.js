/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    albumid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
 
  /*
    Menambahkan constraint UNIQUE, kombinasi dari kolom userid dan albumid.
    Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint('user_album_likes', 'unique_userid_and_albumid', 'UNIQUE(userid, albumid)');
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.userid_users.id', 'FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.albumid_albums.id', 'FOREIGN KEY(albumid) REFERENCES albums(id) ON DELETE CASCADE');
};
 
exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'unique_userid_and_albumid');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.userid_users.id');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.albumid_albums.id');
  pgm.dropTable('user_album_likes');
};