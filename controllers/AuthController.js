const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const checkUser = (req, res) => {
  const token = req.headers["x-auth-token"];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: "error",
          msg: err,
        });
      }
      User.findOne({ email: decoded.email }).then(user => {
        return res.json({
          status: "success",
          token: token,
          user: user,
        });
      });
    });
  } else {
    return res.status(400).json({
      status: "error",
      msg: "Token is not provided.",
    });
  }
};

const SignUpController = (req, res) => {
  const { firstname, lastname, email, password, transferpassword, referralCode, city } = req.body;

  if (!firstname || !lastname || !email || !password || !referralCode || !city || !transferpassword) {
    return res.status(400).json({
      status: "error",
      msg: "Please input fields correctly",
    });
  }

  User.findOne({ email: email }).then(async user => {
    if (user) {
      return res.status(400).json({
        status: "error",
        msg: "Email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const hashedTransferPass = await bcrypt.hash(transferpassword, salt);
    User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPass,
      transferpassword: hashedTransferPass,
      referralCode: referralCode,
      city: city
    }).then(user => {
      jwt.sign(
        {
          email: email,
          password: password,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.json({
            status: "succes",
            token,
            user,
          });
        }
      );
    });
  });
};

const LogInController = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      msg: "Please input fields correctly",
    });
  }

  User.findOne({ email: email }).then(async user => {
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          status: "error",
          msg: "Email or password is not correct",
        });
      } else {
        const token = jwt.sign(
          {
            email: email,
            password: password,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "24h",
          },
          (err, token) => {
            if (err) {
              throw err;
            }
            return res.json({
              status: "success",
              token,
              user,
            });
          }
        );
      }
    } else {
      return res.status(400).json({
        status: "error",
        msg: "Email or password is not correct",
      });
    }
  });
};

const finishSignUp = (req, res) => {
  const token = req.headers["x-auth-token"];
  const exploredFrom = req.body.heard;
  const invitedBy = req.body.referral;
  console.log(exploredFrom, invitedBy);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          status: "error",
          msg: "Expired token, please login again",
        });
      }
      User.findOneAndUpdate(
        { email: decoded.email },
        { exploredFrom: exploredFrom, invitedBy: invitedBy === 'none' ? 0 : invitedBy , signUpStep: 3 }
      ).then(user => {
        return res.json({
          status: "success",
        });
      });
    });
  }
};

const changePassword = (req, res) => {
  const token = req.headers["x-auth-token"];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    const currentPassword = req.body.currentpassword;
    const newPassword = req.body.newpassword;

    User.findOne({ email: decoded.email }).then(async user => {
      if (user) {
        const validPassword = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!validPassword) {
          return res.status(400).json({
            status: "error",
            msg: "Current password is not correct",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedPass = await bcrypt.hash(newPassword, salt);

          User.findOneAndUpdate(
            { email: decoded.email },
            { password: hashedPass }
          ).then(user => {
            return res.json({
              status: "status",
              token: jwt.sign({ email: decoded.email, password: user.pass }),
              user: user,
            });
          });
        }
      }
    });
  });
};

module.exports = {
  checkUser,
  SignUpController,
  LogInController,
  finishSignUp,
  changePassword,
};
