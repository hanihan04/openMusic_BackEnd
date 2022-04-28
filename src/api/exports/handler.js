class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const message = {
      playlistId,
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };
    await this._service.sendMessage('export:playlist_songs', JSON.stringify(message));
    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses.',
    }).code(201);
  }
}

module.exports = ExportsHandler;
