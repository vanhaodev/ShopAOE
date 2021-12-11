const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const globalTextSchema = new Schema({
  globalChat: {
    type: String,
    required: false,
  },
  globalTaixiu: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('globalText', globalTextSchema);
