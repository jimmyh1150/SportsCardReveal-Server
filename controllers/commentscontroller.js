const router = require("express").Router();
const { CommentsModel } = require("../models");
const { validateSession } = require("../middleware");

router.post("/comment", validateSession, async (req, res) => {
  const { content, sportscardId } = req.body.comment;

  try {
    await CommentsModel.create({
      content: content,
      sportscardId: sportscardId,
      userId: req.user.id,
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

module.exports = router;
