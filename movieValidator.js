const z = require("zod");

const movieSchema = z.object({
  tittle: z.string({
    invalid_type_error: "Movie tittle must be a String",
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: "Poster must be a valid URL",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Thriller",
      "Sci-fi",
    ])
  ),
  rate: z.number().min(0).max(10).default(0),
});

function validation(object) {
  return movieSchema.safeParse(object);
}

function partialValidation(object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = {
  validation,
  partialValidation,
};
