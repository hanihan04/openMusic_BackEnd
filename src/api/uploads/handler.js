class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;
 
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }
 
  async postUploadCoverHandler(request, h) {
    const { coverurl } = request.payload;
    const { id: albumId } = request.params;
    this._validator.validateImageHeaders(coverurl.hapi.headers);
    const fileLocation = await this._service.writeFile(coverurl, coverurl.hapi);
    await this._albumsService.addAlbumCover(albumId, fileLocation);
    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah.',
    }).code(201);
  }
}
 
module.exports = UploadsHandler;