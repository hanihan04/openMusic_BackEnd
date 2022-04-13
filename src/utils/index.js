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
   
module.exports = { mapDBToModelSongs, mapDBToModelAlbums };