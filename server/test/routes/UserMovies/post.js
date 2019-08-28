const app = require('../../../../server.js');
const chaiHttp = require('chai-http');
const chai = require('chai');

const { LookupUserMovie, User } = require('../../../models');

const { assert, expect } = chai;
chai.use(chaiHttp);

// Variables
let authToken = null;
const slug = [];
const userId = [];
let tmdb_id = 5548;
let tmdb_id2 = 5549;

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
    .post(`/api/users/${params.slug}/movie`)
    .set({ Authorization: params.authToken })
    .send({ movie_id: params.movie_id });
}

describe('When calling the POST Users Movies route', function() {
  before(async function() {
    this.timeout(10000);
    await createTestUser(testUser);
    await createTestUser(testUser2);
    await loginTestUser();
  });

  after(async function() {
    await deleteTestUser(userId[0]);
    await deleteTestUser(userId[1]);
  });

  describe('When supplying a valid movie id', function() {
    it('should return a 201 when adding a new movie', async function() {
      const res = await route({
        authToken,
        movie_id: tmdb_id,
        slug: slug[0]
      });
      assert.equal(res.status, 201);
      const userLibrary = await LookupUserMovie.findAll({
        where: {
          user_id: userId[0]
        }
      });
      assert.equal(userLibrary.length, 1);
    });

    it('should return a 201 when adding an already existing movie', async function() {
      // Since this is the same result, it shouldn't break, and backend don't care
      const res = await route({
        authToken,
        movie_id: tmdb_id,
        slug: slug[0]
      });
      assert.equal(res.status, 201);
      const userLibrary = await LookupUserMovie.findAll({
        where: {
          user_id: userId[0]
        }
      });
      assert.equal(userLibrary.length, 1);
    });

    it('should return a 201 when adding a 2nd movie', async function() {
      let res = await route({
        authToken,
        movie_id: tmdb_id,
        slug: slug[0]
      });
      assert.equal(res.status, 201);
      res = await route({
        authToken,
        movie_id: tmdb_id2,
        slug: slug[0]
      });
      assert.equal(res.status, 201);
      const userLibrary = await LookupUserMovie.findAll({
        where: {
          user_id: userId[0]
        }
      });
      assert.equal(userLibrary.length, 2);
    });
  });

  describe('When the supplying an invalid movie id', function() {
    it('should return a 404 and an error message when movie id does not exist', async function() {
      this.timeout(10000);
      const res = await route({
        authToken,
        movie_id: 999999999999,
        slug: slug[0]
      });
      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Error adding movie');
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

    it('should return a 400 and an error message when movie id does not exist', async function() {
      const res = await route({
        authToken,
        slug: slug[0]
      });
      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Bad request');
    });
  });

  describe('When attempting to add to a library that does not belong to you', function() {
    it('should return a 401 and an error when adding a new movie', async function() {
      const res = await route({
        authToken,
        movie_id: tmdb_id,
        slug: slug[1]
      });
      assert.equal(res.status, 401);
      assert.equal(
        res.body.access_denied,
        'You do not have permission to add a movie to this library'
      );
    });

    it('should return a 401 and an error when adding a new movie while not logged in', async function() {
      const res = await route({
        authToken: '',
        movie_id: tmdb_id,
        slug: slug[1]
      });
      assert.equal(res.status, 401);
    });
  });
});
