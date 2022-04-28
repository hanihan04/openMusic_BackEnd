const UserLikesAlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'user_album_likes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const userLikesAlbumHandler = new UserLikesAlbumHandler(service);
    server.route(routes(userLikesAlbumHandler));
  },
};
