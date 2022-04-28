class UserLikesAlbumHandler{
  constructor(service) {
    this._service = service;

    this.postUserLikesAlbumByIdHandler = this.postUserLikesAlbumByIdHandler.bind(this);
    this.getUserLikesAlbumByIdHandler = this.getUserLikesAlbumByIdHandler.bind(this);
  }

  async postUserLikesAlbumByIdHandler(request, h){     
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;    
    await this._service.verifyExistingAlbumById(albumId); 
    console.log(albumId);
    console.log(credentialId);
    const Albumliked = await this._service.verifyUserLikesAlbum(credentialId, albumId);     
    if (!Albumliked){
        await this._service.addLikeToAlbum(credentialId, albumId);
        return h.response({
            status: 'success',
            message: 'Album berhasil di-Like.',
        }).code(201);
    }
    await this._service.deleteLikeFromAlbum(credentialId, albumId);
    return h.response({
      status: 'success',
      message: 'Like pada Album berhasil dibatalkan.',
    }).code(201);
  }

  async getUserLikesAlbumByIdHandler(request,h){
    const { id: albumId } = request.params;
    const likesCount = await this._service.getAllLikesCount(albumId);
    console.log(albumId);
    console.log(likesCount.count);
    const response = h.response({
      status: 'success',
      data: {
        likes: likesCount.count,
      },
    });
    response.header('X-Data-Source', likesCount.source);
    response.code(200);
    return response;
  }
}

module.exports = UserLikesAlbumHandler;