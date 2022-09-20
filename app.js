require("dotenv").config();

const express = require("express");

const { validateMovie } = require("./validators.js");

const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");

// GET - Express 02
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);

app.post("/api/users", hashPassword, usersHandlers.postUsers);
app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);

// POST - Express 03
app.post("/api/movies", movieHandlers.postMovie);

// PUT - Express 04
app.put("/api/movies/:id", validateMovie, movieHandlers.putMovie);
app.put("/api/users/:id", usersHandlers.putUsers);

//DELETE - Express 05
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", usersHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
