const functions = require("firebase-functions");
const packagesData = require("../data/PackagesData");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const cors = require("cors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

Client.init("2ae7f7e1-f497-4b99-80b9-f4a33d3bd855");

const { Charge } = resources;

const createCharge = functions.https.onRequest(async(req, res) => {
  const { package, token } = req.body;

      const chargeData = {
        name: package.name + " Package",
        description: `${package.profit} USD daily profit`,
        local_price: {
          amount: package.price,
          currency: "USD",
        },
        pricing_type: "fixed_price",
        metadata: {
          package: package,
          token: token,
        },
        redirect_url: "https://puzzled-singlet-bee.cyclic.app/request/add/in"
      };

      const charge = await Charge.create(chargeData);

      return res.send(charge);
});

const webHookHandler = functions.https.onRequest(async (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.headers["x-cc-webhook-signature"];
  const webHookSecret = "7b625b64-c7ca-4699-b953-eb8b348de1da";

  try {
    const event = Webhook.verifyEventBody(rawBody, signature, webHookSecret);

    if (event.type === "charge:confirmed") {
      const { package, token } = event.data.metadata;
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
      )
      .then(user => {
        User.findOneAndUpdate(
          { referralCode: user.invitedBy },
          { $inc: { balance: (packagesData[package].profit / 100) * 15, referrals: 1 } }
        )
          .then(user => {
            window.location.href = "https://lnninvest.com";
          })
          .catch(err => {
            alert("There's some error occured!");
            window.location.href = "https://lnninvest.com"
          });
      });
    }

    if (event.type === "charge:delayed") {
      alert("Transaction Delayed!");
      window.location.href = "https://lnninvest.com"
    }
  } catch (e) {
    functions.logger.error(e);
    console.log(e);
    res.status(400).json({
      status: "error",
      msg: "there's some error with gateway",
    });
  }
});

module.exports = { createCharge, webHookHandler };
