const app = require('../../../server.js');
const chaiHttp = require('chai-http');
const chai = require('chai');

const { User } = require('../../models');

const { assert, expect } = chai;
chai.use(chaiHttp);

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

async function route(data) {
  return chai
    .request(app)
    .post('/api/login')
    .send(data);
}

describe('When calling the POST login route', function() {
  before(async function() {
    await createTestUser();
  });

  after(async function() {
    await deleteTestUser();
  });

  describe('When valid data is supplied', function() {
    it('should return a 200 and an return an auth token', async function() {
      const res = await route({
        email: testUser.email,
        password: testUser.password
      });
      assert.equal(res.status, 200);
      assert.isObject(res.body);
      assert.isTrue(res.body.success);
      assert.exists(res.body.token);
    });

    it('should return a 401 and an error when the email does not exist', async function() {
      const res = await route({
        email: testUser.email + 'a',
        password: testUser.password
      });
      assert.equal(res.status, 401);
      assert.isObject(res.body);
      assert.equal(res.body.failed, 'That email or password incorrect');
    });

    it('should return a 401 and an error when the password is incorrect', async function() {
      const res = await route({
        email: testUser.email,
        password: testUser.password + 'a'
      });
      assert.equal(res.status, 401);
      assert.isObject(res.body);
      assert.equal(res.body.failed, 'That email or password incorrect');
    });
  });

  describe('When data is missing', function() {
    it('should return a 400 and an error when the password is missing', async function() {
      const res = await route({
        email: testUser.email
      });
      assert.equal(res.status, 400);
      assert.isObject(res.body);
      assert.equal(res.body.password, 'Password field is required');
    });

    it('should return a 400 and an error when the email is missing', async function() {
      const res = await route({
        password: testUser.password
      });
      assert.equal(res.status, 400);
      assert.isObject(res.body);
      assert.equal(res.body.email, 'Email field is required');
    });
  });
});
