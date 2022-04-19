const mapDBToModelSongs = ({ 
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapDBToModelAlbums = ({ 
  id,
  name,
  year,
  inserted_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapDBToModelPlaylists = ({
  id, name, owner
}) => ({id, name, owner});

const mapDBToModelPlaylistSongs = ({
  id, playlistid, songid
}) => ({id, playlistid, songid});

const mapDBToModelPlaylistAct = ({
  id, playlistid, songid, userid, action, time
}) => ({id, playlistid, songid, userid, action, time});

   
module.exports = { 
  mapDBToModelSongs, 
  mapDBToModelAlbums,
  mapDBToModelPlaylists,
  mapDBToModelPlaylistSongs,
  mapDBToModelPlaylistAct,
};