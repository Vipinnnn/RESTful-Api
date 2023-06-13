//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});
const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  // ---------------GET------------//
  .get(async function (req, res) {
    try {
      const foundArticles = await Article.find({});
      res.send(foundArticles);
    } catch (err) {
      console.log(err);
    }
  })
  // ---------------POST------------//
  .post(async function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    try {
      await newArticle.save();
      res.send("Successfully posted article");
    } catch (err) {
      res.send(err);
    }
  })
  // ---------------DELETE Everything------------//
  .delete(async function (req, res) {
    try {
      await Article.deleteMany({});
      res.send("Successfully deleted all articles");
    } catch (err) {
      res.send(err);
    }
  });
// ---------------GET Specific Article------------//
app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    try {
      const foundArticle = await Article.findOne({
        title: req.params.articleTitle,
      });
      res.send(foundArticle);
    } catch (err) {
      res.send("No article found");
      console.log(err);
    }
  })
  // ---------------Update a Specific Article------------//
  .put(async function (req, res) {
    try {
      await Article.findOneAndUpdate(
        {
          title: req.params.articleTitle,
        },
        { title: req.body.title, content: req.body.content },
        { overwrite: true },
        res.send("Article updated Successfully")
      );
    } catch (err) {
      res.send(err);
    }
  })
  // ---------------Update an article using PATCH------------//
  .patch(async function (req, res) {
    try {
      await Article.updateOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.contentS },
        { $set: req.body }
      );
      res.send("Article Patched.");
    } catch (err) {
      res.send(err);
    }
  })
  // ---------------Delete a specific Article------------//
  .delete(async function (req, res) {
    try {
      await Article.deleteOne(
        { title: req.params.articleTitle },
        function (err) {
          if (!err) {
            res.send("Article Deleted");
          }
        }
      );
    } catch (error) {
      res.send(error);
    }
  });

// app.get("/articles", async function (req, res) {
//   try {
//     const foundArticles = await Article.find({});
//     res.send(foundArticles);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/articles", async function (req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });
//   try {
//     await newArticle.save();
//     res.send("Successfully posted article");
//   } catch (err) {
//     res.send(err);
//   }
// });

// app.delete("/articles", async function (req, res) {
//   try {
//     await Article.deleteMany({});
//     res.send("Successfully deleted all articles");
//   } catch (err) {
//     res.send(err);
//   }
// });
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
