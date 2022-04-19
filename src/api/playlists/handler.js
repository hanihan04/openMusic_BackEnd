class SongsHandler{
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);

    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h){
    this._validator.validatePlaylistPayload(request.payload);
    const { name = 'untitled' } = request.payload;
    const { id: credentialId } = request.auth.credentials;      
    await this._service.verifyPlaylistOwner(name, credentialId);
    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan.',
      data: {
          playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request, h){
    const { id: credentialId } = request.auth.credentials; 
    const playlists = await this._service.getPlaylists(credentialId);
    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    }).code(200);
  }

  async deletePlaylistByIdHandler(request, h){
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);   
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus.',
    }).code(200);
  }

  async postSongToPlaylistHandler(request, h){
    this._validator.validateSongsOfPlaylistPayload(request.payload);   
    const { id: playlistId } = request.params; 
    const {songId} = request.payload;
    const { id: credentialId } = request.auth.credentials; 
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);
    await this._service.postPlaylistAct(playlistId, songId, credentialId, 'add');
    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlist.',
    }).code(201);
  }

  async getSongsInPlaylistHandler(request, h){
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials; 
    await this._service.verifyPlaylistAccess(playlistId, credentialId);    
    const playlist = await this._service.getPlaylistById(playlistId); 
    const songs = await this._service.getSongsInPlaylist(playlistId); 
    const getPlaylistWithSongs = {...playlist, songs};
    return h.response({
      status: 'success',
      data: {
        playlist: getPlaylistWithSongs,
      },
    }).code(200);
  }

  async deleteSongFromPlaylistHandler(request, h){
    const { id: playlistId } = request.params; 
    const {songId} = request.payload;
    const { id: credentialId } = request.auth.credentials; 
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    await this._service.postPlaylistAct(playlistId, songId, credentialId, 'delete');
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari Playlist.',
    }).code(200);
  }
  
  async getPlaylistActivitiesHandler(request, h){
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials; 
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlistAct = await this._service.getSongsInPlaylist(playlistId); 
    return h.response({
      status: 'success',
      data: {
        "playlistId": playlistId,
        "activities": getPlaylistAct,
      },
    }).code(200);
  }
}

module.exports = SongsHandler;