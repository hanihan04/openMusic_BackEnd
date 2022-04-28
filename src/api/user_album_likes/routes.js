const routes = (handler) => [
{
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postUserLikesAlbumByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getUserLikesAlbumByIdHandler,
  },
];

module.exports = routes;
  