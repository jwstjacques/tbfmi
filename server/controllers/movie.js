const { movieHelper } = require('./helpers');

module.exports = {
  async getById(req, res) {
    const errors = {};
    try {
      const movie = await movieHelper.find(req.body.movie_id);

      if (!movie) {
        errors[not_found] = 'Resource not found';
        res.status(404).json(errors);
      }

      return res.status(200).json(movies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async list(req, res) {
    try {
      const movies = await movieHelper.getAll();

      // No contents, but not a failed search
      if (movies && movies.length === 0) {
        return res.status(204);
      }

      return res.status(200).json(movies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
