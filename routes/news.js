const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../utils/authService");
const models = require("../models/index");

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message: message
  });
}

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    const newNews = await models.News.create(req.body);
    res.status(201).json({
      success: true,
      data: {
        newNews
      },
      message: "news created"
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get("/", checkTokenMiddleware, (req, res) => {
  models.News.find((err, newsFind) => {
    if (err) {
      res.send({
        status: err.code,
        message: err.message
      });
    }
    if (newsFind) {
      res.send({
        success: true,
        data: {
          news: newsFind
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  });
});

router.post("/:_id/", checkTokenMiddleware, async (req, res) => {
  try {
    let profile = await models.Profile.findById(req.params._id)
      .populate({
        path: "user",
        select: "people",
        populate: { path: "people", model: "People", select: "name" }
      })
      .populate({
        path: "institution",
        model: "InstitutionSchool",
        select: "name"
      });

    if (profile) {
      const newNews = new models.News({
        text: req.body.content,
        user: profile.user.people.name,
        avatar: profile.avatar
      });
      newNews.profile = profile._id;
      await newNews.save();
      profile.news.push(newNews);
      await profile.save();
      res.status(201).json({
        success: true,
        message: "News created",
        newNews
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error
    });
  }
});

router.get("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    let profile = await models.Profile.findById(req.params._id).populate({
      path: "news",
      model: "News"
    });
    if (profile) {
      res.status(200).json({
        success: true,
        message: "News coming",
        data: {
          news: profile.news
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error
    });
  }
});

async function concatNews(follows, id) {
  let news = new Array();

  for (const item of follows) {
    if (item.following == id) {
      let followed = await models.Profile.findById(item.followed)
        .select("news")
        .populate({
          path: "news",
          model: "News"
        });

      news = [...news, ...followed.news];
    }
  }

  return news;
}

router.get("/:_id/feed", checkTokenMiddleware, async (req, res) => {
  try {
    let profile = await models.Profile.findById(req.params._id).populate({
      path: "follow",
      model: "Follow"
    });

    if (profile.follow) {
      concatNews(profile.follow, req.params._id).then(news => {
        res.status(200).json({
          success: true,
          message: "News found",
          data: { news: news }
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: "There are still no news for you about..."
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
