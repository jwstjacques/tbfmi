'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const movie1Attributes = JSON.stringify({
        adult: false,
        backdrop_path: '/szd5SbG2ASP4CUZeF9bdoJ4tVn7.jpg',
        belongs_to_collection: {
          id: 5547,
          name: 'RoboCop Collection',
          poster_path: '/foJBQb9oEOH0mGh77tXyoxXCfzU.jpg',
          backdrop_path: '/azQScQWHpz5puIV4YeCcqgiT9Tn.jpg'
        },
        genres: [
          {
            id: 28,
            name: 'Action'
          },
          {
            id: 53,
            name: 'Thriller'
          },
          {
            id: 878,
            name: 'Science Fiction'
          }
        ],
        id: 5548,
        imdb_id: 'tt0093870',
        original_language: 'en',
        original_title: 'RoboCop',
        overview:
          "In a violent, near-apocalyptic Detroit, evil corporation Omni Consumer Products wins a contract from the city government to privatize the police force. To test their crime-eradicating cyborgs, the company leads street cop Alex Murphy into an armed confrontation with crime lord Boddicker so they can use his body to support their untested RoboCop prototype. But when RoboCop learns of the company's nefarious plans, he turns on his masters.",
        poster_path: '/gtGreTdzYBuQsEwTliEFdTzPleV.jpg',
        production_companies: [
          {
            id: 41,
            logo_path: '/AuAIlCWBrbhbUFFrJ6M9E3ihBoj.png',
            name: 'Orion Pictures',
            origin_country: 'US'
          }
        ],
        production_countries: [
          {
            iso_3166_1: 'US',
            name: 'United States of America'
          }
        ],
        revenue: 53000000,
        runtime: 102,
        spoken_languages: [
          {
            iso_639_1: 'en',
            name: 'English'
          }
        ],
        status: 'Released',
        tagline:
          'Part man. Part machine. All cop. The future of law enforcement.',
        video: false,
        vote_average: 7.2,
        vote_count: 2521
      });

      const movie2Attributes = JSON.stringify({
        adult: false,
        backdrop_path: '/pkuf3xajNzDPzAXtvGNNhs59XBL.jpg',
        belongs_to_collection: {
          id: 5547,
          name: 'RoboCop Collection',
          poster_path: '/foJBQb9oEOH0mGh77tXyoxXCfzU.jpg',
          backdrop_path: '/azQScQWHpz5puIV4YeCcqgiT9Tn.jpg'
        },
        budget: 35000000,
        genres: [
          {
            id: 28,
            name: 'Action'
          },
          {
            id: 12,
            name: 'Adventure'
          },
          {
            id: 80,
            name: 'Crime'
          },
          {
            id: 878,
            name: 'Science Fiction'
          },
          {
            id: 53,
            name: 'Thriller'
          }
        ],
        homepage: null,
        id: 5549,
        imdb_id: 'tt0100502',
        original_language: 'en',
        original_title: 'RoboCop 2',
        overview:
          'After a successful deployment of the Robocop Law Enforcement unit, OCP sees its goal of urban pacification come closer and closer, but as this develops, a new narcotic known as "Nuke" invades the streets led by God-delirious leader Cane. As this menace grows, it may prove to be too much for Murphy to handle. OCP tries to replicate the success of the first unit, but ends up with failed prototypes with suicidal issues... until Dr. Faxx, a scientist straying away from OCP\'s path, uses Cane as the new subject for the Robocop 2 project, a living God.',
        popularity: 13.275,
        poster_path: '/uL3Ab6SOcN35ZTF2XrE1NzFwXdl.jpg',
        production_companies: [
          {
            id: 41,
            logo_path: '/AuAIlCWBrbhbUFFrJ6M9E3ihBoj.png',
            name: 'Orion Pictures',
            origin_country: 'US'
          }
        ],
        production_countries: [
          {
            iso_3166_1: 'US',
            name: 'United States of America'
          }
        ],

        revenue: 45681173,
        runtime: 117,
        spoken_languages: [
          {
            iso_639_1: 'en',
            name: 'English'
          }
        ],
        status: 'Released',
        tagline: "He's back to protect the innocent.",
        video: false,
        vote_average: 5.8,
        vote_count: 840
      });

      await queryInterface.bulkInsert(
        'movies',
        [
          {
            attributes: movie1Attributes,
            name: 'RoboCop',
            release_date: '1987-07-17',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: movie2Attributes,
            name: 'RoboCop 2',
            release_date: '1987-07-17',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {
          transaction
        }
      );

      await queryInterface.bulkInsert(
        'cast_and_crew',
        [
          {
            name: 'Paul Verhoeven',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Irvin Kershner',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {
          transaction
        }
      );

      await queryInterface.bulkInsert(
        'cast_and_crew_types',
        [
          {
            name: 'Director',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {
          transaction
        }
      );

      await queryInterface.bulkInsert(
        'lookup_movie_cast_and_crew',
        [
          {
            cast_and_crew_id: 1,
            cast_and_crew_type_id: 1,
            movie_id: 1,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            cast_and_crew_id: 2,
            cast_and_crew_type_id: 1,
            movie_id: 2,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {
          transaction
        }
      );

      await queryInterface.bulkInsert(
        'search_keywords',
        [
          {
            attributes: JSON.stringify({ id: 853 }),
            word: 'crime fighter',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 12190 }),
            word: 'cyberpunk',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 679 }),
            word: 'cyborg',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 18021 }),
            word: 'detroit',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 14964 }),
            word: 'drugs',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 4565 }),
            word: 'dystopia',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 1706 }),
            word: 'experiment',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 163082 }),
            word: 'gentrification',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 163081 }),
            word: 'law enforcement',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 6149 }),
            word: 'police',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 15090 }),
            word: 'police officer',
            created_at: new Date(),
            updated_at: new Date()
          },

          {
            attributes: JSON.stringify({ id: 184213 }),
            word: 'robocop',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 14544 }),
            word: 'robot',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 9663 }),
            word: 'sequel',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            attributes: JSON.stringify({ id: 6110 }),
            word: 'weapon',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {
          transaction
        }
      );

      await queryInterface.bulkInsert(
        'genres',
        [
          {
            name: 'Action',
            attributes: JSON.stringify({
              id: 28
            }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Adventure',
            attributes: JSON.stringify({
              id: 12
            }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Crime',
            attributes: JSON.stringify({
              id: 80
            }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Science Fiction',
            attributes: JSON.stringify({
              id: 878
            }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Thriller',
            attributes: JSON.stringify({
              id: 53
            }),
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {
          transaction
        }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lookup_movie_cast_and_crew', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    await queryInterface.bulkDelete('cast_and_crew', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    await queryInterface.bulkDelete('cast_and_crew_types', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    await queryInterface.bulkDelete('movies', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
  }
};
