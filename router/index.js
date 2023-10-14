const express = require("express");
const {
  LogInController,
  SignUpController,
  checkUser,
  finishSignUp,
  changePassword,
} = require("../controllers/AuthController");
const {
  createCharge,
  webHookHandler
 } = require("../controllers/ChargeController");
const addContactRequest = require("../controllers/ContactUsController");
const { makePartner, makeInvitorPartner } = require("../controllers/PartnerController");
const {
  StartBusinesses,
  BuildBusinesses,
  GoInProfit,
  RewardPartners,
} = require("../controllers/RewardController");
const { AddTask } = require("../controllers/TaskController");
const {
  getTransfers,
  InsertTransferRequest,
} = require("../controllers/TransferController");
const getReq = require("../controllers/getApiReq");


const router = express.Router();

router.get("/", (req, res) => {
  res.send("API LNNINVEST");
});

router.post("/user", checkUser);
router.post("/signup", SignUpController);
router.post("/signup/finish", finishSignUp);
router.post("/change/password", changePassword);
router.post("/login", LogInController);

router.post("/start/business", StartBusinesses);
router.post("/build/business", BuildBusinesses);
router.post("/go/profit", GoInProfit);
router.post("/reward/partners", RewardPartners);
router.post("/add/bronze/partner", makeInvitorPartner);

router.post("/get/transfers", getTransfers);
router.post("/insert/transfers", InsertTransferRequest);

router.post("/insert/contact", addContactRequest);

router.post("/get/package", makePartner);

router.post("/task/add", AddTask);

router.post("/create/charge", createCharge);
router.post("/request/add/in", getReq)
router.post("/request/webhook/handler", webHookHandler);

module.exports = router;
