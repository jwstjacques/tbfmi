const app = require('../../../../server.js');
const chaiHttp = require('chai-http');
const chai = require('chai');

const { LookupUserMovie, User } = require('../../../models');

const { assert, expect } = chai;
chai.use(chaiHttp);

// Variables
let authToken = null;
const movieId = [];
const slug = [];
let tmdb_id = 5548;
let tmdb_id2 = 5549;
const userId = [];

const testUser = {
  email: 'chai_test_user@example.com',
  user_name: 'chaitestuser',
  password: '123456',
  password2: '123456'
};

const testUser2 = {
  email: 'chai_test_user2@example.com',
  user_name: 'chaitestuser2',
  password: '123456',
  password2: '123456'
};

async function addMovie(movieId) {
  return chai
    .request(app)
    .post(`/api/users/${slug[0]}/movie`)
    .set({ Authorization: authToken })
    .send({ movie_id: movieId });
}

async function createTestUser(data) {
  const res = await chai
    .request(app)
    .post('/api/register')
    .send(data);
  assert.equal(res.status, 201);

  slug.push(res.body.slug);
  userId.push(res.body.id);
}

async function deleteTestUser(user_id) {
  await LookupUserMovie.destroy({
    where: {
      user_id: user_id
    }
  });
  await User.destroy({
    where: {
      id: user_id
    }
  });
}

async function loginTestUser(data) {
  const res = await chai
    .request(app)
    .post('/api/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });
  expect(res.body.success).to.be.true;
  authToken = res.body.token;
}

async function route(params) {
  return chai
    .request(app)
    .delete(`/api/users/${params.slug}/movie/${params.movie_id}`)
    .set({ Authorization: params.authToken });
}

describe('When calling the DELETE Users Movies route', function() {
  before(async function() {
    this.timeout(10000);
    await createTestUser(testUser);
    await createTestUser(testUser2);
    await loginTestUser();
    await addMovie(tmdb_id);
    await addMovie(tmdb_id2);
    const userLibrary = await LookupUserMovie.findAll({
      where: {
        user_id: userId[0]
      }
    });

    for (const movie of userLibrary) {
      movieId.push(movie.movie_id);
    }
  });

  after(async function() {
    await deleteTestUser(userId[0]);
    await deleteTestUser(userId[1]);
  });

  describe('When supplying a valid movie id', function() {
    it('should return a 202 when deleting a movie', async function() {
      const res = await route({
        authToken,
        movie_id: movieId[0],
        slug: slug[0]
      });
      assert.equal(res.status, 202);
      const userLibrary = await LookupUserMovie.findAll({
        where: {
          user_id: userId[0],
          movie_id: movieId[0]
        }
      });
      assert.equal(userLibrary.length, 0);
    });

    it('should return a 202 when deleting a movie that is not in library', async function() {
      let res = await route({
        authToken,
        movie_id: movieId[0],
        slug: slug[0]
      });
      assert.equal(res.status, 202);
      res = await route({
        authToken,
        movie_id: movieId[0],
        slug: slug[0]
      });
      assert.equal(res.status, 202);
      const userLibrary = await LookupUserMovie.findAll({
        where: {
          user_id: userId[0],
          movie_id: movieId[0]
        }
      });
      assert.equal(userLibrary.length, 0);
    });
  });

  describe('When the supplying an invalid movie id', function() {
    it('should return a 202 when the movie id does not exist', async function() {
      const res = await route({
        authToken,
        movie_id: 0,
        slug: slug[0]
      });
      assert.equal(res.status, 202);
    });

    it('should return a 400 and an error message when movie id is a word string', async function() {
      const res = await route({
        authToken,
        movie_id: 'batman',
        slug: slug[0]
      });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad request');
    });
  });

  describe('When attempting to delete from a library that does not belong to you', function() {
    it('should return a 401 and an error', async function() {
      const res = await route({
        authToken,
        movie_id: movieId[0],
        slug: slug[1]
      });
      assert.equal(res.status, 401);
      assert.equal(
        res.body.access_denied,
        'You do not have permission to delete a movie from this library'
      );
    });

    it('should return a 401 and an error when not logged in', async function() {
      const res = await route({
        authToken: '',
        movie_id: tmdb_id,
        slug: slug[1]
      });
      assert.equal(res.status, 401);
    });
  });
});
