const {
  CastAndCrew,
  CastAndCrewType,
  Genre,
  Movie,
  LookupMovieCastAndCrew
} = require('../../models');
const { tmdbAPIService } = require('../../services');

const movieDetails = {
  attributes: ['attributes', 'id', 'name', 'release_date'],
  include: [
    {
      as: 'MovieCastAndCrew',
      attributes: ['cast_and_crew_id', 'cast_and_crew_type_id', 'movie_id'],
      include: [
        {
          attributes: ['attributes', 'id', 'name'],
          model: CastAndCrew
        },
        {
          attributes: ['id', 'name'],
          model: CastAndCrewType
        }
      ],
      model: LookupMovieCastAndCrew
    }
  ]
};

function convertResultsToObjects(results) {
  const cleaned = [];
  for (movie of results) {
    const director =
      movie.MovieCastAndCrew &&
      movie.MovieCastAndCrew[0] &&
      movie.MovieCastAndCrew[0].CastAndCrew
        ? movie.MovieCastAndCrew[0].CastAndCrew.name
        : '';
    const poster_path =
      movie.attributes && movie.attributes.poster_path
        ? movie.attributes.poster_path
        : '';
    const tmdb_id =
      movie.attributes && movie.attributes.id ? movie.attributes.id : '';
    const rating = movie.personal_rating ? movie.personal_rating : null;

    cleaned.push({
      id: movie.id,
      director,
      poster_path,
      rating,
      release_date: movie.release_date,
      title: movie.name,
      tmdb_id
    });
  }

  return cleaned;
}

async function processCastAndCrew(member, movieId) {
  const castAndCrewTypeName = member.job;

  try {
    const castAndCrewType = await CastAndCrewType.findOrCreate({
      where: {
        name: castAndCrewTypeName
      }
    });

    const castAndCrewMember = await CastAndCrew.findOrCreate({
      where: {
        name: member.name
      }
    });

    await LookupMovieCastAndCrew.findOrCreate({
      where: {
        cast_and_crew_id: castAndCrewMember[0].id,
        cast_and_crew_type_id: castAndCrewType[0].id,
        movie_id: movieId
      }
    });
  } catch (err) {
    throw new Error('Failed to insert cast and crew member');
  }
}

module.exports = {
  convertResultsToObjects,
  async find(movieId) {
    try {
      const movie = await Movie.findByPk(movieId, movieDetails);

      if (movie && movie.length) {
        return convertResultsToObjects(movie);
      }

      return [];
    } catch (error) {
      throw new Error({ error: error.message });
    }
  },
  async getAll() {
    try {
      const movies = await Movie.findAll(movieDetails);

      if (movies && movies.length) {
        const moviePayload = convertResultsToObjects(movies);
        return {
          page: 1,
          total_results: moviePayload.length,
          movies: moviePayload
        };
      }

      return [];
    } catch (error) {
      throw new Error({ error });
    }
  },
  async insert(movie) {
    try {
      const newMovie = {
        name: movie.title,
        release_date: movie.release_date
      };

      const newMovieAttributes = movie;
      delete movie.title;
      delete movie.release_date;

      newMovie.attributes = newMovieAttributes;

      const insertedMovie = await Movie.findOrCreate({
        defaults: newMovie,
        where: {
          name: newMovie.name
        }
      });

      // Extract extra information
      for (const genre of movie.genres) {
        await Genre.findOrCreate({
          where: {
            name: genre.name
          }
        });
      }

      const castAndCrew = await tmdbAPIService.getMovieCastAndCrew(movie.id);

      for (const member of castAndCrew.crew) {
        if (member.job === 'Director') {
          await processCastAndCrew(member, insertedMovie[0].id);
        }
      }

      return insertedMovie;
    } catch (err) {
      throw new Error('Error inserting movie');
    }
  },
  async search(req, res) {
    try {
      const movie = await tmdbAPIService.getMovieByName();
      return res.status(200).json(movie);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
