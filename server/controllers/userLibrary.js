const { movieHelper, userHelper } = require('./helpers');
const {
  CastAndCrew,
  Movie,
  LookupMovieCastAndCrew,
  LookupUserMovie
} = require('../models');
const Sequelize = require('sequelize');
const { tmdbAPIService } = require('../services');
const isEmpty = require('../validation/is-empty');

const Op = Sequelize.Op;

/**
 * Sequelize associations are creating the proper query, but not returning
 * the object properly.  Had to drop the cast and crew association to return
 * proper results.
 *
 * ACTUAL GENERATED QUERY FROM THE SEQUELIZE QUERY
 *
 * SELECT "LookupUserMovie"."attributes", "LookupUserMovie"."movie_id",
 * "LookupUserMovie"."rating", "LookupUserMovie"."user_id",
 * "Movie"."attributes" AS "Movie.attributes", "Movie"."id" AS "Movie.id",
 * "Movie"."name" AS "Movie.name", "Movie"."release_date" AS "Movie.release_date",
 * "Movie->MovieCastAndCrew"."attributes" AS "Movie.MovieCastAndCrew.attributes",
 * "Movie->MovieCastAndCrew"."cast_and_crew_id" AS "Movie.MovieCastAndCrew.cast_and_crew_id",
 * "Movie->MovieCastAndCrew"."cast_and_crew_type_id" AS "Movie.MovieCastAndCrew.cast_and_crew_type_id",
 * "Movie->MovieCastAndCrew"."movie_id" AS "Movie.MovieCastAndCrew.movie_id",
 * "Movie->MovieCastAndCrew"."movie_id" AS "Movie.MovieCastAndCrew.MovieId"
 * FROM "lookup_user_movie" AS "LookupUserMovie"
 * LEFT OUTER JOIN "movies" AS "Movie"
 * ON "LookupUserMovie"."movie_id" = "Movie"."id"
 * LEFT OUTER JOIN "lookup_movie_cast_and_crew" AS "Movie->MovieCastAndCrew"
 * ON "Movie"."id" = "Movie->MovieCastAndCrew"."movie_id"
 * WHERE "LookupUserMovie"."user_id" = <USER ID>;
 *
 * This hack adds the directors to the final object
 */
async function addDirectorsToFormattedResults(formattedResults) {
  const movieIdArray = formattedResults.map((result) => {
    return result.id;
  });

  const movieDirectors = await LookupMovieCastAndCrew.findAll({
    attributes: ['movie_id', 'cast_and_crew_id'],
    include: [
      {
        attributes: ['id', 'name'],
        model: CastAndCrew
      }
    ],
    where: {
      movie_id: {
        [Op.in]: movieIdArray
      }
    }
  });

  const movieDirectorMap = {};

  for (const director of movieDirectors) {
    if (movieDirectorMap.hasOwnProperty(director.movie_id)) {
      movieDirectorMap[director.movie_id].push(director.CastAndCrew.name);
    } else {
      movieDirectorMap[director.movie_id] = [director.CastAndCrew.name];
    }
  }

  for (result of formattedResults) {
    result.director = movieDirectorMap[result.id].join('');
  }
}

module.exports = {
  async addToList(req, res) {
    if (
      !req.user ||
      !req.user.id ||
      !req.params ||
      !req.params.slug ||
      !req.body ||
      !req.body.movie_id ||
      isNaN(req.body.movie_id)
    ) {
      return res.status(400).send({ error: 'Bad request' });
    }

    const tmdbMovieId = parseInt(req.body.movie_id);
    const slug = req.params.slug;
    const userId = req.user.id;

    const isUser = await userHelper.confirmUser(userId, slug);

    if (!isUser) {
      return res.status(401).send({
        access_denied:
          'You do not have permission to add a movie to this library'
      });
    }

    let localVersionOfMovie = await Movie.findAll({
      where: {
        attributes: {
          [Op.contains]: {
            id: tmdbMovieId
          }
        }
      }
    });

    if (isEmpty(localVersionOfMovie)) {
      // Put the tmdb data into our database
      const movieDetails = await tmdbAPIService.getMovieById(tmdbMovieId);
      try {
        localVersionOfMovie = await movieHelper.insert(movieDetails);
      } catch (err) {
        return res.status(404).send({ error: 'Error adding movie' });
      }
    }

    await LookupUserMovie.findOrCreate({
      where: {
        movie_id: localVersionOfMovie[0].id,
        user_id: userId
      }
    });

    return res.status(201).send();
  },
  async list(req, res) {
    try {
      if (!req.params || !req.params.slug) {
        return res.status(400).send({ error: 'Bad request' });
      }

      const userDataFromSlug = await userHelper.getUserDataFromSlug(
        req.params.slug
      );

      if (userDataFromSlug.length === 0) {
        return res.status(404).send({ error: 'User does not exist' });
      }

      const userId = userDataFromSlug[0].id;

      // TODO: Fix Broken Sequelize associations betwen movies and cast and crew
      const userLibrary = await LookupUserMovie.findAll({
        attributes: ['attributes', 'movie_id', 'rating', 'user_id'],
        include: [
          {
            attributes: ['attributes', 'id', 'name', 'release_date'],
            // TODO: Broken association
            // include: [
            //   {
            //     as: 'MovieCastAndCrew',
            //     attributes: [
            //       'cast_and_crew_id',
            //       'cast_and_crew_type_id',
            //       'movie_id'
            //     ],
            //     include: [
            //       {
            //         attributes: ['attributes', 'id', 'name'],
            //         model: CastAndCrew
            //       },
            //       {
            //         attributes: ['id', 'name'],
            //         model: CastAndCrewType
            //       }
            //     ],
            //     model: LookupMovieCastAndCrew
            //   }
            // ],
            model: Movie
          }
        ],
        where: {
          user_id: userId
        }
      });

      const unformattedMovies = userLibrary.map((lookup) => {
        const newMovie = lookup.Movie;
        newMovie.personal_rating = lookup.rating;
        return newMovie;
      });

      const formattedResults = await movieHelper.convertResultsToObjects(
        unformattedMovies
      );

      // TODO: Fix and Remove Hack
      await addDirectorsToFormattedResults(formattedResults);

      // TODO: Add pagination and total results functionality
      return res.status(200).send({
        user_id: userId,
        page: 1,
        total_results: formattedResults.length,
        movies: formattedResults
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  async removeFromList(req, res) {
    if (
      !req.user ||
      !req.user.id ||
      !req.params ||
      !req.params.slug ||
      !req.params.id ||
      isNaN(req.params.id)
    ) {
      return res.status(400).send({ error: 'Bad request' });
    }

    const tbfmiMovieId = parseInt(req.params.id);
    const slug = req.params.slug;
    const userId = req.user.id;

    const isUser = await userHelper.confirmUser(userId, slug);

    if (!isUser) {
      return res.status(401).send({
        access_denied:
          'You do not have permission to delete a movie from this library'
      });
    }

    // No need to track if the row didn't exist before, same result
    await LookupUserMovie.destroy({
      where: {
        movie_id: tbfmiMovieId,
        user_id: userId
      }
    });

    return res.status(202).send({ message: 'Movie removed' });
  },
  async setRating(req, res) {
    if (
      !req.user ||
      !req.user.id ||
      !req.params ||
      !req.params.slug ||
      !req.params.id ||
      !req.body ||
      !req.body.hasOwnProperty('rating') ||
      isNaN(req.body.rating) ||
      isNaN(req.params.id)
    ) {
      return res.status(400).send({ error: 'Bad request' });
    }

    const tbfmiMovieId = parseInt(req.params.id);
    const rating = parseInt(req.body.rating);
    const slug = req.params.slug;
    const userId = req.user.id;

    const isUser = await userHelper.confirmUser(userId, slug);

    if (!isUser) {
      return res.status(401).send({
        access_denied:
          'You do not have permission to rate a movie in this library'
      });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(422)
        .send({ error: 'Rating value must be between 1 and 5' });
    }

    const movie = await LookupUserMovie.findAll({
      where: {
        movie_id: tbfmiMovieId,
        user_id: userId
      }
    });

    if (movie.length === 1) {
      await LookupUserMovie.update(
        {
          rating: rating
        },
        {
          where: {
            movie_id: tbfmiMovieId,
            user_id: userId
          }
        }
      );
    } else {
      return res
        .status(404)
        .send({ error: 'This movie is not in your library' });
    }

    return res.status(204).send();
  }
};
