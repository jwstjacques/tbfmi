const {
  movieController,
  searchController,
  userLibraryController,
  userController
} = require('../../controllers');
const passport = require('passport');

module.exports = (app) => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the API!'
    })
  );

  app.post('/api/register', userController.create);
  app.post('/api/login', userController.login);

  app.get('/api/users/:slug/movie', userLibraryController.list);
  app.post(
    '/api/users/:slug/movie',
    passport.authenticate('jwt', { session: false }),
    userLibraryController.addToList
  );

  app.delete(
    '/api/users/:slug/movie/:id',
    passport.authenticate('jwt', { session: false }),
    userLibraryController.removeFromList
  );
  app.put(
    '/api/users/:slug/movie/:id',
    passport.authenticate('jwt', { session: false }),
    userLibraryController.setRating
  );

  app.post(
    '/api/search',
    passport.authenticate('jwt', { session: false }),
    searchController.find
  );

  app.get('/api/movie/all', movieController.list);
};
