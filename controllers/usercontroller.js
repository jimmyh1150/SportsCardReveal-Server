const router = require("express").Router();
const { UserModel } = require("../models");
const models = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateSession = require("../middleware/validate-session");
const isAdminRole = require("../middleware/is-admin-role");

/*
=================
USER REGISTRATION
=================
*/
router.post("/register", async (req, res) => {
  let { email, username, password, role } = req.body.user;

  try {
    const User = await UserModel.create({
      email,
      username,
      password: bcrypt.hashSync(password, 13),
      role,
    });

    let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(201).json({
      message: "User Successfully Registered",
      user: User,
      sessionToken: token,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email or Username Already In Use",
      });
    } else {
      res.status(500).json({
        error: `Failed to Register User: ${err}`,
      });
    }
  }
});

/*
===========
USER LOGIN
===========
*/

router.post("/login", async (req, res) => {
  let { email, password } = req.body.user;

  try {
    let loginUser = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (loginUser) {
      let passwordComparison = await bcrypt.compare(
        password,
        loginUser.password
      );

      if (passwordComparison) {
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        });

        res.status(200).json({
          user: loginUser,
          message: "User Successfully Logged In!",
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect Email or Password!",
        });
      }
    } else {
      res.status(401).json({
        message: "Incorrect Email or Password!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: `Failed to Login User: ${err}`,
    });
  }
});

/*
==========================
GET ALL USERS - ADMIN ONLY
==========================
*/
router.get("/allUsers", async (req, res) => {
  try {
    const user = await models.UserModel.findAll();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to Get Users" });
  }
});

/*\
==================================================================================
GET ALL USERS ALONG WITH ALL SPORTS CARDS AND COMMENTS LINKED TO USER - ADMIN ONLY
==================================================================================
*/
router.get("/userinfo", async (req, res) => {
  try {
    await models.UserModel.findAll({
      include: [
        {
          model: models.SportscardModel,
          include: [
            {
              model: models.CommentsModel,
            },
          ],
        },
      ],
    }).then((user) => {
      res.status(200).json({
        user: user,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to Get Users: ${err}`,
    });
  }
});

/*
=========================
DELETE USERS - ADMIN ONLY
=========================
*/
router.delete("/:id", [validateSession, isAdminRole], async (req, res) => {
  try {
    const locatedUser = await UserModel.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "User Successfully Deleted", locatedUser });
  } catch (err) {
    res.status(500).json({ message: `Failed to Delete User: ${err}` });
  }
});

module.exports = router;
