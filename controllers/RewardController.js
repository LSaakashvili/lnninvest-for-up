const packagesData = require("../data/PackagesData");
const User = require("../models/User");

const StartBusinesses = (req, res) => {
  User.updateMany(
    { isPartner: true, businessCondition: 1, businessType: 1 },
    {
      businessCondition: 2,
      businessType: Math.floor(Math.random() * (8 - 2 + 1) + 2),
    }
  )
    .then(user => {
      return res.json({
        status: "success",
      });
    })
    .catch(err => {
      return res.status(400).json({
        status: "error",
        msg: err,
      });
    });
};

const BuildBusinesses = (req, res) => {
  User.updateMany(
    { isPartner: true, businessCondition: 2 },
    { businessCondition: 3 }
  )
    .then(user => {
      return res.json({
        status: "success",
      });
    })
    .catch(err => {
      return res.status(400).json({
        status: "error",
        msg: err,
      });
    });
};

const GoInProfit = (req, res) => {
  const today = new Date();

  User.find({ isPartner: true, businessCondition: 3 }).then(users => {
    if (users) {
      users.map(user => {
        const difference =
          new Date(user.profitDate).getTime() - new Date().getTime();
        const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

        if (TotalDays < 1) {
          User.findOneAndUpdate(
            { email: user.email },
            {
              businessCondition: 4,
            }
          ).then(() => {
              console.log(`User ${user.email} Updated`);
          });
        } else {
          console.log("There's no any users to go in profit")
        }
      });
    }
  });
};

const RewardPartners = (req, res) => {
  User.find({ isPartner: true }).then(users => {
    if (users) {
      users.map(user => {
        User.updateMany(
          { email: user.email },
          { $inc: { balance: packagesData[user.package].profit } }
        ).then(res => {
          console.log(`User ${user.email} Rewarded`);
        });
      });
    }
  });
};

module.exports = {
  StartBusinesses,
  BuildBusinesses,
  GoInProfit,
  RewardPartners,
};
