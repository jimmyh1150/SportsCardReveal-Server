let Express = require("express");
let router = Express.Router();
let validateSession = require("../middleware/validate-session");
const { SportscardModel } = require("../models");

/*
====================
SPORTS CARD CREATE
====================
*/

router.post("/create", validateSession, async (req, res) => {
  const {
    playerFirstName,
    playerLastName,
    playerTeamCity,
    playerTeamName,
    playerSport,
    cardBrand,
    cardYear,
    cardNumber,
    cardDescription,
  } = req.body.Sportscard;

  const SportscardEntry = {
    playerFirstName,
    playerLastName,
    playerTeamCity,
    playerTeamName,
    playerSport,
    cardBrand,
    cardYear,
    cardNumber,
    cardDescription,
    userId: req.user.id,
  };

  try {
    const newSportscardEntry = await SportscardModel.create(SportscardEntry);
    res.status(200).json(newSportscardEntry);
  } catch (err) {
    res.status(500).json({ message: `Failed to add Sports card. ${err}` });
  }
});

/*
=============================
GET ALL SPORTS CARDS BY ENTRY
=============================
*/

router.get("/", async (req, res) => {
  try {
    const SportscardEntries = await SportscardModel.findAll();
    res.status(200).json(SportscardEntries);
  } catch (err) {
    res.status(500).json({
      error: `Failed to retrieve all Sports Card entries: ${err}`,
    });
  }
});

/*
=====================================
GET ALL SPORTS CARDS - LOGGED IN USER
=====================================
*/

router.get("/mine", validateSession, async (req, res) => {
  const { id } = req.user;
  try {
    const userSportscards = await SportscardModel.findAll({
      where: {
        userId: id,
      },
    });
    res.status(200).json(userSportscards);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to fetch user Sports Cards: ${err}` });
  }
});

router.put("/update/:id", validateSession, async (req, res) => {
  const {
    playerFirstName,
    playerLastName,
    playerTeamCity,
    playerTeamName,
    playerSport,
    cardBrand,
    cardYear,
    cardNumber,
    cardDescription,
  } = req.body.Sportscard;
  try {
    const updateSportscard = await SportscardModel.update(
      {
        playerFirstName,
        playerLastName,
        playerTeamCity,
        playerTeamName,
        playerSport,
        cardBrand,
        cardYear,
        cardNumber,
        cardDescription,
      },
      { where: { id: req.params.id }, returning: true }
    ).then((result) => {
      res.status(200).json({
        message: "Sports Card Successfully Updated!",
        result,
      });
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Failed to Update Sports Card Entry: ${err}` });
  }
});

/*
===========================
DELETE SPORTS CARD BY ENTRY
===========================
*/

router.delete("/delete/:id", validateSession, async (req, res) => {
  try {
    const locatedSportsCard = await SportscardModel.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({
      message: "Sports Card Successfully Deleted!",
      locatedSportsCard,
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to Delete Sports Card: ${err}` });
  }
});

module.exports = router;
