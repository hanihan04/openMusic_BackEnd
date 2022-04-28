const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});
const SongsOfPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
 
module.exports = { PlaylistPayloadSchema, SongsOfPlaylistPayloadSchema };