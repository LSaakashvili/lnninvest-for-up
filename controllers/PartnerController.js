const packagesData = require("../data/PackagesData");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { user } = require("firebase-functions/v1/auth");

const makePartner = async (req, res) => {
  const { package, token } = req.body.metadata;
  const decodedToken = jwt.decode(token);
  const today = new Date().getDate();
  const profitDate = new Date();

  const businessType = 1;
  const businessCondition = 1;

  profitDate.setDate(today + packagesData[package].days);

  await User.findOneAndUpdate(
    { email: decodedToken.email },
    {
      isPartner: true,
      joinDate: new Date(),
      profitDate: profitDate,
      package: package,
      businessType: businessType,
      businessCondition: businessCondition,
    }
  ).then(user => {
    User.findOneAndUpdate(
      { referralCode: user.invitedBy },
      {
        $inc: {
          balance: (packagesData[package].price / 100) * 15,
          referrals: 1,
        },
      }
    )
      .then(user => {
        return res.json({
          status: "success",
          joinDate: user.joinDate,
          profitDate: user.profitDate,
        });
      })
      .catch(err => {
        return res.json({
          status: "success",
          joinDate: user.joinDate,
          profitDate: user.profitDate,
        });
      });
  });
};

const makeInvitorPartner = (req, res) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(400).json({
      status: "error",
      msg: "There's some error occured",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        msg: err,
      });
    }

    const { email } = decoded;
    const businessType = 1;
    const businessCondition = 1;

    User.findOne({ email: email }).then(user => {
      if (user && user.referrals >= 3) {
        User.findOneAndUpdate(
          { email: email },
          {
            isPartner: true,
            joinDate: new Date(),
            profitDate: new Date(),
            package: "bronze",
            businessType: businessType,
            businessCondition: businessCondition,
          }
        ).then(user => {
          User.findOneAndUpdate(
            { referralCode: user.invitedBy },
            { $inc: { balance: (packagesData["bronze"].profit / 100) * 15, referrals: 1 } }
          )
            .then(user => {
              return res.json({
                status: "success",
                joinDate: user.joinDate,
                profitDate: user.profitDate,
              });
            })
            .catch(err => {
              return res.json({
                status: "success",
                joinDate: user.joinDate,
                profitDate: user.profitDate,
              });
            });
        });
      }
      else {
        return res.status(400).json({
            "status": "error",
            "msg": "You don't have enough referrals"
        })
      }
    });
  });
};

module.exports = { makePartner, makeInvitorPartner };
