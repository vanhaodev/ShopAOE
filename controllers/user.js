const Users = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");
const globalText = require("../models/globalText");
const levelCal = require('../controllers/games/level');
const tixiu_checkResult = require('./games/tixiu_checkResult')
const formatUSD = require('../bin/helper/formatUSD');
const { json } = require("body-parser");
const order = require("../models/order");
exports.getAccount = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  const messageSucc = req.flash("success")[0];
  const messageError = req.flash("error")[0];
  Order.find({ user: req.user }).then(order => {
    res.render("account", {
      title: "Thông tin tài khoản",
      user: req.user,
      cartProduct: cartProduct,
      order: order,
      messageSucc: messageSucc,
      messageError: messageError
    });
  });
};

exports.getAccountChange = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("account-change-info", {
    title: "Thay đổi thông tin tài khoản",
    user: req.user,
    cartProduct: cartProduct
  });
};

exports.postAccountChange = (req, res, next) => {
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;
  req.user.email = req.body.email;
  req.user.address = req.body.address;
  req.user.phoneNumber = req.body.phoneNumber;
  req.user.save();
  res.redirect("/account");
};

exports.play_Taixiu = (req, res, next) => {
  if (req.isAuthenticated()) {
    var top20 = [];
    var top20DESC = [];
    var topTemp;
    Users.find({}, null, { limit: 30 }).then(users => {
      top20 = users;
      for (var i = 0; i < top20.length; i++) {
        for (var j = i + 1; j < top20.length; j++) {
          if (top20[i].dollar < top20[j].dollar) {
            topTemp = top20[i].dollar;
            top20[i].dollar = top20[j].dollar;
            top20[j].dollar = topTemp;
          }
        }
        var dollar = formatUSD(top20[i].dollar);
        top20DESC.push({ username: top20[i].username, dollar: dollar, level: top20[i].level });
      }
    });


    const messageSucc = req.flash("success")[0];
    const messageError = req.flash("error")[0];
    const taixiu_winorlost = req.cookies['taixiu_winorlost'];
    const taixiu_logs = req.cookies['taixiu_logs'];
    const taixiu_cuocvalue = req.cookies['taixiu_cuocvalue'];
    const taixiu_cuavalue = req.cookies['taixiu_cuavalue'];

    var globalWinnerX5 = [];
    globalText.find({ index: 0 }).then(kq => {
      globalWinnerX5.push({globalTaixiu: kq[0].globalTaixiu});
    });

    Users.find({ user: req.user }).then(user => {
      res.render("gameTaixiu", {
        title: "Tài xỉu ring quà VIP",
        username: req.user.username,
        level: req.user.level, exp: req.user.exp,
        dollar: formatUSD(req.user.dollar),
        tx_winorlost: taixiu_winorlost,
        tx_logs: taixiu_logs,
        tx_cuoc: taixiu_cuocvalue,
        tx_cua: taixiu_cuavalue,
        tx_globallogs: globalWinnerX5,
        top20: top20DESC,
        messageSucc: messageSucc,

        messageError: messageError
      });
    });
  } 
  else {
    res.redirect("/login");
  }

};

exports.play_Taixiu_checking = (req, res, next) => {
  res.clearCookie('taixiu_winorlost');
  res.clearCookie('taixiu_logs');
  res.clearCookie('taixiu_cuocvalue');
  res.clearCookie('taixiu_cuavalue');
  if (req.isAuthenticated()) {
    const messageSucc = req.flash("success")[0];
    const messageError = req.flash("error")[0];
    Users.find({ user: req.user }).then(user => {
      if (req.body) {
        var randomValue1;
        var randomValue2;
        var randomValue3;
        var randomX2;
        var randomX5;
        var resultRandom = [];
        var clientValue = Number(req.body.inputCua);
        var tienCuoc = Number(req.body.inputCuoc);
        
        res.cookie('taixiu_cuocvalue', tienCuoc);
        res.cookie('taixiu_cuavalue', clientValue);
        //tienCuoc < req.user.dollar && tienCuoc < 100001
        if (tienCuoc < req.user.dollar && tienCuoc < 100001) {
          //console.log(tienCuoc, " nhỏ hơn ", req.user.dollar)
          randomValue1 = Math.floor(Math.random() * 10) + 1; //random 1
          randomValue2 = Math.floor(Math.random() * 10) + 1; //random 2
          randomValue3 = Math.floor(Math.random() * 10) + 1; //random 3
          
          randomX5 = Math.floor(Math.random() * 10) + 1; //random x5 tiền thưởng


          resultRandom.push(tixiu_checkResult(randomValue1));
          resultRandom.push(tixiu_checkResult(randomValue2));
          resultRandom.push(tixiu_checkResult(randomValue3));



          if (clientValue > 12 || clientValue < 1) {
            res.cookie('taixiu_logs', 'Có lỗi xảy ra, dữ liệu không hợp lệ nè, đừng F12! không được đâu :)))');
            return res.redirect('back');
          }

          if (clientValue == randomValue1 || clientValue == randomValue2 || clientValue == randomValue3) //nếu chọn đúng
          {
              

            if (randomX5 === 5) {
              // BÁO KÊNH THẾ GIỚI
              globalText.findOneAndUpdate({ index: 0 }, {
                $set: {
                  globalChat: '',
                  globalTaixiu: `Chúc mừng ${req.user.username} may mắn nhận x5 tiền thưởng lên đến ${formatUSD(tienCuoc * 5)}`,
                }
                },
                { new: true }, (err, globaltext) => {
                  if (err) {
                    console.log("Something wrong when updating data!");
                  }
  
                });
                //=========================//random từ 50 đến 300. (251 + 5 = 301)
                req.user.exp += ((tienCuoc/100) * (Math.floor(Math.random() * 251) + 50))*5;
                req.user.level = levelCal(req.user.exp);
              req.user.dollar = (req.user.dollar + (tienCuoc * 5));
              res.cookie('taixiu_winorlost', `Chúc mừng bạn đã chiến thắng ${formatUSD(tienCuoc * 5)}$ \n| Kết quả 
            ${resultRandom[0]}, ${resultRandom[1]}, ${resultRandom[2]} | Bạn được x5 tiền thưởng.`);
            }
            else 
            {
              req.user.exp += (tienCuoc/100) * (Math.floor(Math.random() * 251) + 50);
              req.user.level = levelCal(req.user.exp);
              req.user.dollar = (req.user.dollar + tienCuoc);
              res.cookie('taixiu_winorlost', `Chúc mừng bạn đã chiến thắng ${formatUSD(tienCuoc)}$ \n| Kết quả 
            ${resultRandom[0]}, ${resultRandom[1]}, ${resultRandom[2]}`);
            }
            req.user.save();
            res.redirect('back');
          }
          else //chọn sai
          {
            req.user.dollar = (req.user.dollar - tienCuoc);
            req.user.save();
            res.cookie('taixiu_winorlost', `Bạn đã thua ${formatUSD(tienCuoc)}$ \n| Kết quả 
            ${resultRandom[0]}, ${resultRandom[1]}, ${resultRandom[2]}`);
            res.redirect('/taixiu')
          }

        }
        else {
          console.log('về nhà --==============================================================')
          res.cookie('taixiu_logs', `Tài khoản của bạn không đủ ${formatUSD(tienCuoc)}`);
          return res.redirect("/taixiu");
        }
      }
      else {
        console.log(' body ko tồn tại --==============================================================')
        res.cookie('taixiu_logs', 'Có lỗi xảy ra, dữ liệu không hợp lệ nè, đừng F12! không được đâu :)))');
        return res.redirect("/taixiu");
      }
    });
  } else {
    console.log(' ko thể xác minh --==============================================================')
    return res.redirect("/login");
  }

};