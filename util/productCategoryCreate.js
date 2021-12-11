const mongoose = require("mongoose");
const ProductCategory = require("../models/productCategory");
const urlConnect2 = `mongodb://localhost:27017/aoeshop`;

// Connect to database
function testCtg(){
  mongoose.connect(urlConnect2, { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log("Category successfully!!");
  
    var abc = new ProductCategory({
      name: "Quần",
      childName: ["Quần Dài", "Quần Ngắn", "Quần Thể Thao", "Quần Lót"]
    });
  
    abc.save(function(err) {
      if (err) throw err;
      console.log("Category successfully saved.");
    });
  });
}
module.exports = testCtg;