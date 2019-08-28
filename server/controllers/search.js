const { tmdbAPIService } = require('../services');

module.exports = {
  async find(req, res) {
    try {
      const searchResults = await tmdbAPIService.getMovieByName(req.body);
      return res.status(200).json(searchResults);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
