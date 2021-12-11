const mongoose = require("mongoose");
const Product = require("../models/product");
const urlConnect = `mongodb://localhost:27017/aoeshop`;

// Connect to database
function testCreate() {
  mongoose.connect(urlConnect, { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log("Connect successfully!! - Phần product Create");

    var product = new Product({
      name: "Trang trí nữ bằng da",
      description: "Đôi khi có những thứ không ai biết nó là gì luôn",
      stock: 123,
      price: 444,
      tags: ["#vip", "#pro", "#cute"],
      size: ["S", "M"],
      productType: { main: "Phụ Kiện", sub: "Trang Trí" },
      color: ["Nâu"],
      pattern: "Trơn",
      images: [
        "product-39.jpg",
        "product-39-01.jpg",
        "product-39-02.jpg"
      ],
      label: "Mob",
      materials: ["100% Da"],
      gender: "male",
      
    });

    product.save(function (err) {
      if (err) throw err;
      console.log("Product successfully saved.");
    });
  });
}

module.exports = testCreate;