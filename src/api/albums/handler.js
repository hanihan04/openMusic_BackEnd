class AlbumsHandler{
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);    
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h){
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload; 
    const albumId = await this._service.addAlbum({ name, year });
    return h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    }).code(201);
  }

  async getAlbumByIdHandler(request, h){
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getAlbumSongsByAlbumId(id);
    const getAlbumWithSongs = {
      ...album,
      coverUrl: (album.coverUrl === null)? null:`http://${process.env.HOST}:${process.env.PORT}/albums/images/${album.coverUrl}`,
      songs,
    };
    return h.response({
      status: 'success',
      data: {
        album: getAlbumWithSongs,
      },
    }).code(200);
  }

  async putAlbumByIdHandler(request, h){
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params; 
    await this._service.editAlbumById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    }).code(200);
  }

  async deleteAlbumByIdHandler(request, h){
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    }).code(200);
  }  
}

module.exports = AlbumsHandler;