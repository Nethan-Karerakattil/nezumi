const { Schema, model } = require("mongoose");

module.exports = model("song", new Schema({
    _id: String,
    
    song_info: {
        song_name: String,
        ext: String,
        verified: Boolean
    },

    creator_info: {
        creator_name: String,
        creator_id: String
    }
}, { timestamps: true }));