const mongoose = require("mongoose");
const label = require("../models/label");
const urlCreateLabels = `mongodb://localhost:27017/aoeshop`;

// Connect to database
function createLabel(){
  mongoose.connect(urlCreateLabels, { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log("Connect successfully!!");
  
    var abc = new label({
      list: [
        "all",
        "nike",
        "louisvuitton",
        "hermes",
        "gucci",
        "adidas",
        "chanel",
        "zara",
        "prada",
        "other"
      ]
    });
  
    abc.save(function(err) {
      if (err) throw err;
      console.log("Category successfully saved.");
    });
  });
}
module.exports = createLabel;