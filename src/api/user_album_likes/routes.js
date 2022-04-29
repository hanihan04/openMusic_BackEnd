const routes = (handler) => [
{
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: handler.postUserLikesAlbumByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: handler.getAlbumLikesByIdHandler,
  },
];

module.exports = routes;
  