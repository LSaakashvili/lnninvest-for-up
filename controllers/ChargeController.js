const functions = require("firebase-functions");
const packagesData = require("../data/PackagesData");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

Client.init("c054fecd-6196-49e6-860d-36583b4da26c");

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
        }
      };

      const charge = await Charge.create(chargeData);

      return res.send(charge);
});

const webHookHandler = functions.https.onRequest(async (req, res) => {
  const rawBody = req.body;
  const signature = req.headers["x-cc-webhook-signature"];
  const webHookSecret = "e7795bde-ac10-4919-966b-55f18c5dd68b";

  try {
    const event = Webhook.verifyEventBody(JSON.stringify(rawBody), signature, webHookSecret);

    const objEvent = JSON.parse(JSON.stringify(event));
    if (event.type === "charge:confirmed") {
      const package = JSON.parse(objEvent.data.metadata.package);
      const token = objEvent.data.metadata.token;
      console.log(package, token);
      console.log(objEvent)
      const decodedToken = jwt.decode(token);
      const today = new Date().getDate();
      const profitDate = new Date();

      const businessType = 1;
      const businessCondition = 1;

      profitDate.setDate(today + packagesData[package.name.toLowerCase()].days);

      await User.findOneAndUpdate(
        { email: decodedToken.email },
        {
          isPartner: true,
          joinDate: new Date(),
          profitDate: profitDate,
          package: package.name.toLowerCase(),
          businessType: businessType,
          businessCondition: businessCondition,
        }
      )
      .then(user => {
        User.findOneAndUpdate(
          { referralCode: user.invitedBy },
          { $inc: { balance: (packagesData[package.name.toLowerCase()].profit / 100) * 15, referrals: 1 } }
        )
        .then(resp => {
          res.json({
            "status": "success",
            "msg": "sucessfully bought"
          })
        })
          .catch(err => {
            alert("There's some error occured!");
            window.location.href = "https://lnninvest.com"
          });
      });
    }

    else {
      res.json({
        "status": "success"
      })
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
