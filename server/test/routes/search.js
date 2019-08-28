const app = require('../../../server.js');
const chaiHttp = require('chai-http');
const chai = require('chai');

const { User } = require('../../models');

const { assert, expect } = chai;
chai.use(chaiHttp);

// Variables
let authToken = null;
const invalidMovieTitle = 'ageageaeareageaerawegaegaerawrawerw';
const movieTitle = 'robocop';

const testUser = {
  email: 'chai_test_user@example.com',
  user_name: 'chaitestuser',
  password: '123456',
  password2: '123456'
};

async function createTestUser() {
  return chai
    .request(app)
    .post('/api/register')
    .send(testUser);
}

async function deleteTestUser() {
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

async function route(data) {
  return chai
    .request(app)
    .post('/api/search')
    .set({ Authorization: authToken })
    .send(data);
}

async function routeNotLoggedIn(data) {
  return chai
    .request(app)
    .post('/api/search')
    .send(data);
}

describe('When calling the POST search route', function() {
  describe('When the user is logged in', function() {
    before(async function() {
      await createTestUser();
      await loginTestUser();
    });

    after(async function() {
      await deleteTestUser();
    });

    it('should return a 200 and an array of search results when the movie exists', async function() {
      this.timeout(10000);
      const res = await route({ query: movieTitle }, authToken);
      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.page);
      assert.exists(res.body.total_results);
      assert.exists(res.body.total_pages);
      assert.exists(res.body.results);
      assert.equal(res.body.page, 1);
    });

    it('should return a 200 and an empty array of search results when the movie does not exist', async function() {
      const res = await route({ query: invalidMovieTitle }, authToken);
      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.exists(res.body.page);
      assert.exists(res.body.total_results);
      assert.exists(res.body.total_pages);
      assert.exists(res.body.results);
      assert.equal(res.body.page, 1);
      assert.equal(res.body.total_results, 0);
      assert.equal(res.body.results, 0);
    });

    it('should return a 400 when a query is not supplied', async function() {
      const res = await route({}, authToken);
      assert.equal(res.status, 400);
      assert.isObject(res.body);
      assert.exists(res.body.error, 'Missing required query parameter');
    });
  });

  describe('When the user is not logged in', function() {
    it('should return a 401', async function() {
      const res = await routeNotLoggedIn({ query: movieTitle });
      assert.equal(res.status, 401);
    });
  });
});
