const app = require('../../../../server.js');
const chaiHttp = require('chai-http');
const chai = require('chai');

const { LookupUserMovie, User } = require('../../../models');

const { assert, expect } = chai;
chai.use(chaiHttp);

// Variables
let authToken = null;
let slug = null;
let userId = null;
let tmdb_id = 5548;
let tmdb_id2 = 5549;

const testUser = {
  email: 'chai_test_user@example.com',
  user_name: 'chaitestuser',
  password: '123456',
  password2: '123456'
};

async function addMovieToTestUserLibrary() {
  await loginTestUser();
  await chai
    .request(app)
    .post(`/api/users/${slug}/movie`)
    .set({ Authorization: authToken })
    .send({ movie_id: tmdb_id });

  await chai
    .request(app)
    .post(`/api/users/${slug}/movie`)
    .set({ Authorization: authToken })
    .send({ movie_id: tmdb_id2 });
}

async function createTestUser() {
  const res = await chai
    .request(app)
    .post('/api/register')
    .send(testUser);
  assert.equal(res.status, 201);

  slug = res.body.slug;
  userId = res.body.id;
}

async function deleteTestUser() {
  await LookupUserMovie.destroy({
    where: {
      user_id: userId
    }
  });
  await User.destroy({
    where: {
      user_name: testUser.user_name
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

async function route(suppliedSlug) {
  return chai.request(app).get(`/api/users/${suppliedSlug}/movie`);
}

describe('When calling the GET Users Movies route', function() {
  before(async function() {
    this.timeout(10000);
    await createTestUser();
    await addMovieToTestUserLibrary();
  });

  after(async function() {
    await deleteTestUser();
  });

  describe('When the slug exists', function() {
    it('should return a 200 and an array with one movie', async function() {
      const res = await route(slug);
      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.page);
      assert.exists(res.body.total_results);
      assert.exists(res.body.movies);

      const firstResult = res.body.movies[0];
      const secondResult = res.body.movies[1];

      assert.exists(firstResult.id);
      assert.isTrue(firstResult.hasOwnProperty('rating'));
      assert.exists(firstResult.hasOwnProperty('poster_path'));
      assert.exists(firstResult.id);
      assert.exists(firstResult.tmdb_id);
      assert.equal(firstResult.tmdb_id, tmdb_id);

      assert.exists(secondResult.id);
      assert.isTrue(secondResult.hasOwnProperty('rating'));
      assert.exists(secondResult.hasOwnProperty('poster_path'));
      assert.exists(secondResult.id);
      assert.exists(secondResult.tmdb_id);
      assert.equal(secondResult.tmdb_id, tmdb_id2);
    });
  });

  describe('When the slug does not exist', function() {
    it('should return a 404 with an error', async function() {
      const res = await route('not-a-slug');
      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'User does not exist');
    });
  });
});
