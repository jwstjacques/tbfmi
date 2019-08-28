const app = require('../../../server.js');
const chaiHttp = require('chai-http');
const chai = require('chai');

const { User } = require('../../models');

const { assert, expect } = chai;
chai.use(chaiHttp);

const testUser = {
  email: 'chai_test_user@example.com',
  user_name: 'Chai_test User',
  password: '123456',
  password2: '123456'
};

async function route(data) {
  return chai
    .request(app)
    .post('/api/register')
    .send(data);
}

describe('When calling the POST register route', function() {
  describe('When valid data is supplied', function() {
    it('should return a 201 and return a user object', async function() {
      const res = await route(testUser);
      assert.equal(res.status, 201);
      assert.isObject(res.body);
      assert.equal(res.body.email, testUser.email);
      assert.equal(res.body.slug, 'chai_test-user');
      assert.exists(res.body.password);
      assert.exists(res.body.createdAt);
      assert.exists(res.body.updatedAt);
      assert.isNull(res.body.attributes);
    });

    it('should return a 201 and return a user object with an incremented slug', async function() {
      const newTest = Object.assign({}, testUser);
      newTest.email = 'some@email.com';
      const res = await route(newTest);
      assert.equal(res.status, 201);
      assert.isObject(res.body);
      assert.equal(res.body.email, newTest.email);
      assert.equal(res.body.slug, 'chai_test-user1');
      assert.exists(res.body.password);
      assert.exists(res.body.createdAt);
      assert.exists(res.body.updatedAt);
      assert.isNull(res.body.attributes);
    });

    it('should return a 400 when the email already exists', async function() {
      const res = await route(testUser);
      assert.equal(res.status, 400);
      assert.isObject(res.body);
      assert.equal(res.body.email, 'A user with that email already exists');
    });

    after(async function() {
      await User.destroy({
        where: {
          user_name: testUser.user_name
        }
      });
    });
  });

  describe('When invalid data is supplied', function() {
    it('should return a 400 when the email address is missing', async function() {
      const missingData = Object.assign({}, testUser);
      delete missingData.email;
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.email, 'Email field is required');
    });

    it('should return a 400 when the email address is empty string', async function() {
      const missingData = Object.assign({}, testUser);
      missingData.email = '';
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.email, 'Email field is required');
    });

    it('should return a 400 when the email address is invalid', async function() {
      const missingData = Object.assign({}, testUser);
      missingData.email = missingData.email.slice(0, -4);
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.email, 'Email is invalid');
    });

    it('should return a 400 when the user_name is missing', async function() {
      const missingData = Object.assign({}, testUser);
      delete missingData.user_name;
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.user_name, 'User name field is required');
    });

    it('should return a 400 when the user_name is less than 2 characters', async function() {
      const missingData = Object.assign({}, testUser);
      missingData.user_name = 'a';
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(
        res.body.user_name,
        'User name must be between 2 and 30 characters'
      );
    });

    it('should return a 400 when the user_name is greater than 30 characters', async function() {
      const missingData = Object.assign({}, testUser);
      missingData.user_name = 'quinquagintaquadringentilliardth';
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(
        res.body.user_name,
        'User name must be between 2 and 30 characters'
      );
    });

    it('should return a 400 when the password is missing', async function() {
      const missingData = Object.assign({}, testUser);
      delete missingData.password;
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.password, 'Password field is required');
    });

    it('should return a 400 when the password is less than 6 characters', async function() {
      const missingData = Object.assign({}, testUser);
      missingData.password = 'abcde';
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.password, 'Password must be at least 6 characters');
    });

    it('should return a 400 when the password is less than 6 characters', async function() {
      const missingData = Object.assign({}, testUser);
      missingData.password = 'quinquagintaquadringentillionths';
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.password, 'Password must be at least 6 characters');
    });

    it('should return a 400 when the password2 is missing', async function() {
      const missingData = Object.assign({}, testUser);
      delete missingData.password2;
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.password2, 'Confirm Password field is required');
    });

    it('should return a 400 when password and password2 are present but different', async function() {
      const missingData = Object.assign({}, testUser);
      missingData.password2 = '654321';
      const res = await route(missingData);
      assert.equal(res.status, 400);
      assert.equal(res.body.password2, 'Passwords must match');
    });
  });
});
