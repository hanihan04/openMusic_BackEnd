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
  coverUrl,
  inserted_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  coverUrl: coverUrl,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapDBToModelPlaylists = ({
  id, name, username
}) => ({id, name, username});

const mapDBToModelPlaylistAct = ({
  username, title, action, time
}) => ({username, title, action, time});

   
module.exports = { 
  mapDBToModelSongs, 
  mapDBToModelAlbums,
  mapDBToModelPlaylists,
  mapDBToModelPlaylistAct,
};