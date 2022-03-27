const path = require("path");
const express = require("express");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger);

const whitelist = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "https://www.google.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("^/$|/index(.html)?", (req, resp) => {
  resp.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, resp) => {
  resp.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, resp) => {
  resp.redirect(301, "/new-page.html");
});

app.get(
  "/hello(.html)?",
  (req, resp, next) => {
    console.log("attempted to hello file");
    next();
  },
  (req, resp) => {
    resp.send("Hello World");
  }
);

const one = (req, resp, next) => {
  console.log("one");
  next();
};

const two = (req, resp, next) => {
  console.log("two");
  next();
};

const three = (req, resp) => {
  console.log("three");
  resp.send("finished");
};

app.get("/chain(.html)?", [one, two, three]);

app.all("*", (req, resp) => {
  resp.status(404);

  if (req.accepts("html")) {
    resp.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    resp.json({ err: "404 Not Found" });
  } else {
    resp.type("txt").json({ err: "404 Not Found" });
  }
});

app.use(errorHandler);

app.listen(PORT, console.log(`listening on port ${PORT}...`));
