const router = require("express").Router();
const { CommentsModel } = require("../models");
const { validateSession } = require("../middleware");
// const test

router.post("/comment/:id", validateSession, async (req, res) => {
  const { content } = req.body.comment;
  const sportscardId = req.params.id;
  const userId = req.user.id;

  try {
    await CommentsModel.create({
      content: content,
      sportscardId: sportscardId,
      userId: userId,
    }).then((comment) => {
      res.status(201).json({
        comment: comment,
        message: "Comment Created",
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to Create Comment: ${err}`,
    });
  }
});

//this will only return every comment from database - not just by sportscardId
router.get("/allComments/:id", validateSession, async (req, res) => {
  const sportscardId = req.params.id;
  try {
    const cardComments = await CommentsModel.findAll({
      sportscardId: sportscardId,
    });
    res.status(200).json(cardComments);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch Card Comments: ${err}` });
  }
});

module.exports = router;
