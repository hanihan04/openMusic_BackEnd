class UserLikesAlbumHandler{
  constructor(service, albumsService) {
    this._service = service;

    this.postUserLikesAlbumByIdHandler = this.postUserLikesAlbumByIdHandler.bind(this);
    this.getAlbumLikesByIdHandler = this.getAlbumLikesByIdHandler.bind(this);
  }

  async postUserLikesAlbumByIdHandler(request, h){         
    const { albumId } = request.params;    
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyExistingAlbumById(albumId);      
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

  async getAlbumLikesByIdHandler(request,h){
    const { albumId } = request.params;
    await this._service.verifyExistingAlbumById(albumId);
    const likesCount = await this._service.getAllLikesCount(albumId);
    return h.response({
      status: 'success',
      data: {
        likes: likesCount.count,
      },
    }).header('X-Data-Source', likesCount.source).code(200);
  }
}

module.exports = UserLikesAlbumHandler;