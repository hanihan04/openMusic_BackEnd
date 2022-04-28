class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;
 
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }
 
  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const fileLocation = await this._service.writeFile(cover, cover.hapi);
    await this._albumsService.addAlbumCover(albumId, fileLocation);
    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah.',
    }).code(201);
  }
}
 
module.exports = UploadsHandler;