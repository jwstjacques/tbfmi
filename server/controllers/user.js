const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const Sequelize = require('sequelize');
const slugify = require('slugify');

const Op = Sequelize.Op;

const { User } = require('../models');

// Validators
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

module.exports = {
  async create(req, res) {
    try {
      const { errors, isValid } = validateRegisterInput(req.body);

      // Check validation of body
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const user = await User.findOne({
        attributes: ['email'],
        where: {
          email: req.body.email
        }
      });

      if (user) {
        errors.email = 'A user with that email already exists';
        return res.status(400).json(errors);
      } else {
        const newUser = {
          email: req.body.email,
          user_name: req.body.user_name,
          password: req.body.password
        };

        // Being slug generation process
        let slug = slugify(req.body.user_name, {
          replacement: '',
          lower: true
        });

        // Find all slugs like the slugified username
        const existingSlugs = await User.findAll({
          attributes: ['slug'],
          where: {
            slug: { [Op.like]: `%${slug}%` }
          }
        });

        // Iteratively add numbers to the slug to create unique slug
        if (existingSlugs.length) {
          const slugs = new Set();
          for (const existing of existingSlugs) {
            slugs.add(existing.slug);
          }

          let i = 1;
          let newSlug = slug;

          while (slugs.has(newSlug)) {
            newSlug = slug + i;
            i++;
          }
          slug = newSlug;
        }

        newUser.slug = slug;

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.password = hash;
            const successfulCreation = (theUser = await User.create(newUser));
            return res.status(201).send(successfulCreation);
          });
        });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  async login(req, res) {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation of body
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      errors.failed = 'That email or password incorrect';
      return res.status(401).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          avatar: user.avatar,
          id: user.id,
          name: user.name
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: '7d' },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.failed = 'That email or password incorrect';
        return res.status(401).json(errors);
      }
    });
  }
};
