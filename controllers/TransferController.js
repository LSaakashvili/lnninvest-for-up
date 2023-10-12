const Transfer = require("../models/Transfer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const packagesData = require("../data/PackagesData");

const InsertTransferRequest = (req, res) => {
  const token = req.headers["x-auth-token"];

  if (!req.body.transferpassword) {
    return res.status(400).json({
      status: "error",
      msg: "TransferPassword is not provided",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) throw err;

    User.findOne({ email: decodedToken.email }).then(async user => {
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.transferpassword,
          user.transferpassword
        );
        if (user.balance > req.body.amount) {
          if (!validPassword) {
            return res.status(400).json({
              status: "error",
              msg: "TransferPassword is not correct",
            });
          }

          var transferedMoney = 0;
          await Transfer.find({ requestedBy: decodedToken.email }).then(transfers => {
            transfers.forEach(transfer => {
              transferedMoney += transfer.amount;
            })
          })
          
          if (user.referrals === 0) {
            return res.status(400).json({
              status: "error",
              msg: "You must invite at least one referral to transfer your money",
            });
          }

          if (transferedMoney > ( packagesData[user.package].price / 2 * user.referrals )) {
            return res.status(400).json({
              status: "error",
              msg: "You have to invite one more referral to continue withdraw"
            })
          }

          Transfer.create({
            transferid: req.body.transferid,
            address: req.body.address,
            amount: req.body.amount,
            requestedBy: decodedToken.email,
          })
            .then(transfer => {
              User.findOneAndUpdate(
                { email: decodedToken.email },
                { $inc: { balance: -req.body.amount } }
              ).then(user => {
                return res.json({
                  status: "success",
                });
              });
            })
            .catch(err => {
              return res.status(400).json({
                status: "error",
                msg: "ERROR",
              });
            });
        }
        else {
          return res.status(400).json({
            status: "error",
            msg: "There's not enough amount on your balance",
          });
        }
      }
    });
  });
};

const getTransfers = (req, res) => {
  const token = req.headers["x-auth-token"];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) throw err;

    const email = decodedToken.email;

    Transfer.find({ requestedBy: email })
      .sort({ _id: -1 })
      .then(transfers => {
        if (transfers) {
          return res.json({
            status: "success",
            transactions: transfers,
          });
        }
      })
      .catch(err => {
        return res.status(400).json({
          status: "error",
          msg: "There's some error",
        });
      });
  });
};

module.exports = { InsertTransferRequest, getTransfers };
