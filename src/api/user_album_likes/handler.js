class UserLikesAlbumHandler{
  constructor(service) {
    this._service = service;

    this.postUserLikesAlbumByIdHandler = this.postUserLikesAlbumByIdHandler.bind(this);
    this.getUserLikesAlbumByIdHandler = this.getUserLikesAlbumByIdHandler.bind(this);
  }

  async postUserLikesAlbumByIdHandler(request, h){
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    const Albumliked = await this.verifyUserLikesAlbum(userId, albumId);
    if (!Albumliked){
        await this._service.addLikeToAlbum(userId, albumId);
        return h.response({
            status: 'success',
            message: 'Album berhasil disukai.',
        }).code(201);
    }
    await this._service.deleteLikeFromAlbum(userId, albumId);
    return h.response({
      status: 'success',
      message: 'Like pada Album berhasil dibatalkan.',
    }).code(201);
  }

  async getUserLikesAlbumByIdHandler(request,h){
    const { id: albumId } = request.params;
    const likeCount = await this._service.getUsersLikeCount(albumId);
    return h.response({
      status: 'success',
      data: {
          "Album Likes": likeCount.count,
      },
    }).header('X-Data-Source', likeCount.source).code(200);
  }
}

module.exports = UserLikesAlbumHandler;