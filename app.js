const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const { validation, partialValidation } = require("./movieValidator.js");
const { error } = require("node:console");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
    );
    return res.send(filteredMovies);
  }
  res.send(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ message: "Movie not found" });
});

app.post("/movies", (req, res) => {
  const result = validation(req.body);
  if (result.error) {
    res.status(404).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const result = partialValidation(req.body);
  if (result.error) res.json({ error: JSON.parse(result.error.message) });

  const { id } = req.params;
  const indexMovie = movies.findIndex((Element) => Element.id === id);
  if (indexMovie === -1) {
    return res.status(400).json({ message: "Movie does not found" });
  }

  const updateMovie = {
    ...movies[indexMovie],
    ...result.data,
  };
  movies[indexMovie] = updateMovie;
  return res.status(202).json(updateMovie);
});

app.listen(3000, () => {
  console.log("servidor escuchando pe causa:");
});
