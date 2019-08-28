const axios = require('axios');

const { TMDB_API_KEY } = require('../../config/keys.js');

const tmdbUrl = new URL('https://api.themoviedb.org/3/');

function appendQueryParameters(params, type) {
  let url = new URL(tmdbUrl);
  let movieId;
  let queryParameters = { api_key: TMDB_API_KEY };

  // Default to US English for now
  const language = !params || !params.language ? 'en-US' : params.language;

  switch (type) {
    case 'search':
      url = new URL('search/movie', url);

      // Default to first page
      const page = !params || !params.page ? 1 : params.page;

      queryParameters['include_adult'] = false;
      queryParameters['language'] = language;
      queryParameters['page'] = page;
      queryParameters['query'] = params.query;

      if (params && params.year) {
        queryParameters['year'] = params.year;
      }
      break;
    case 'credits':
      if (
        typeof params === 'number' ||
        (typeof params === 'string' && !isNaN(params))
      ) {
        movieId = params;
      } else {
        throw new Error('Missing movie id');
      }
      url = new URL(`movie/${movieId}/credits`, url);
      break;
    case 'findById':
      if (
        typeof params === 'number' ||
        (typeof params === 'string' && !isNaN(params))
      ) {
        movieId = params;
      } else {
        throw new Error('Missing movie id');
      }
      url = new URL(`movie/${movieId}`, url);
    default:
      break;
  }

  for (const key in queryParameters) {
    url.searchParams.append(key, queryParameters[key]);
  }

  return url;
}

/**
 * GET Movies by tmdb id
 *
 * https://api.themoviedb.org/3/movie/{movie_id}&api_key={api_key}
 *
 * @param {object}
 * @param {string} movieId [REQUIRED] - The tmdb id for a movie

 **/
async function getMovieById(movieId) {
  if (!movieId) {
    throw new Error('Missing movie id');
  }

  const url = appendQueryParameters(movieId, 'findById');
  try {
    const searchResults = await axios.request(url.href);
    return searchResults.data;
  } catch (err) {
    console.error({ error: err.message });
  }
}

/**
 * GET Movies by name
 *
 * https://api.themoviedb.org/3/search/movie?api_key={api_key}
 * &language=en-US [DEFAULT]
 * &query={params.query} [REQUIRED]
 * &page={params.page} [OPTIONAL] || 1 if not set
 * &include_adult=false
 *
 * @param {object}
 * @param {string} query [REQUIRED] - Name of the movie to search for
 * @param {integer} page [OPTIONAL] - Page number to return
 * @param {integer} year [OPTIONAL] - Four-digit representation of release year
 **/
async function getMovieByName(params) {
  if (!params || !params.query) {
    throw new Error('Missing required query parameter');
  }

  const url = appendQueryParameters(params, 'search');
  try {
    const searchResults = await axios.request(url.href);
    return searchResults.data;
  } catch (err) {
    console.error({ error: err.message });
  }
}

/**
 * GET The cast and crew for a movie by it's tmdb id
 *
 * https://api.themoviedb.org/3/search/movie/{movieId}/credits?api_key={api_key}
 *
 * @param {object}
 * @param {string} movieId [REQUIRED] - The tmdb id for a movie
 **/
async function getMovieCastAndCrew(movieId) {
  if (!movieId) {
    throw new Error('Missing movie id');
  }

  const url = appendQueryParameters(movieId, 'credits');
  try {
    const searchResults = await axios.request(url.href);
    return searchResults.data;
  } catch (err) {
    console.error({ error: err.message });
  }
}

module.exports = {
  getMovieById,
  getMovieByName,
  getMovieCastAndCrew
};
