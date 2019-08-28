# tbfmi - The Best Freakin' Movies

Eventual Heroku Link <https://tbfmi.herokuapp.com>

### Employs the use of the following packages:

Express for routing
Axios for requests
Sequelize ORM
pg for postgres assistance
Validator for validation
Mocha for unit/integration testing
Chai for assertion in unit tests
Chai-http to assist with unit tests
jwt for auth tokens
passport of auth management
passport-jwt same as above
body-parser to handle requests
slugify to translate user names into useable slugs
tmdb API for data

### To start:

1. Install postgres
   > (ex. brew install postgresql)
2. You should probably get postico, cuz it helps
3. From postgres either CLI or postico as super user
   > CREATE DATABASE tbfmi;
4. Create user
   > CREATE USER tbfmi WITH ENCRPTYED PASSWORD '1234';
5. Grant privileges
   > GRANT ALL PRIVILEGES ON DATABASE tbfmi TO tbfmi;
6. Install all packages, from root of project
   > npm install
7. Create tables
   > sequelize db:migrate
8. Create seed data (optional)
   > npm run seed
9. If you want to get rid of seed data (optional)
   > npm run deseed
10. Run unit tests
    > npm run test
11. Install postman (you need this)
12. Import docs/tbfmi.postman_collection.json to postman for endpoints
13. Create user

I use RoboCop (the greatest movie ever made) as my test movie. It has a tmdb id of 5548. RoboCop 2 and 3 are 5549 and 5550 respectively, but are less good movies.

### Database

The database is in Postgres using Sequelize ORM.
The tables are:

1. user
2. movies
3. cast_and_crew
4. lookup_movie_cast_and_crew (handling associations between movies and their respective cast and crew)
5. cast_and_crew_type (Only has director right now)
6. genre (updating on inserts but not in use)
7. search_keyword (not being utilized)
8. lookup_user_movies

Because Sequeilze is silly about the pluralizatoin of tables vs. model, I opted for cast_and_crew over people, just cuz. I also chose movie/movies to avoid the medium/media business (personal choice, sue me).

All meta data is stored in an entity attribute pattern in an JSONB column called attributes. This will allow for quick fleshing out, when necessary, is queryable (because Postgres is great), and allows for a lot of meta data and no joins!!!

### What can be accomplished:

1. Create an account.
2. Login to an account (7 day auth token timeout)
3. Add a movie to your library.
4. Delete a movie from your library.
5. Update the rating of a movie in your library.
6. Search for a movie with a string (just searching on title at the moment), will return 1st page of matching results only
7. View the library of a user (nothing is private, but cannot be changed by non-owner)

### Validation:

1. All library changes (add, delete, rating) require auth token
2. Search requires auth token since it is using an API key belonging to tbfmi
3. Normal sanity adding (no same email, slugs cannot be the same, cannot change other's libraries, error handling)

### What is done:

1. MVP routes (login/registration/search/movies)
2. Integration tests with reasonable coverage
3. Error handling
4. Utilization of an external resource

### What needs to be done:

1. Change password (v2) _-- Super Trivial_
2. Delete account (v2) _-- Super Trivial_
3. Keyword search (v2) _-- Super Trivial_
4. Work with genres (v2) _-- Super Trivial_
5. Sorting results (V2)
6. Unit tests on services, helpers, controllers _-- Super Trivial_
7. Fix a sequelize association issue that generates the proper query, but doesn't return the data properly (h4x0rs for life! for the win)
8. Allow full cast and crew to be input (one line change) _-- Super Trivial_
9. Other search options (v2) _-- Trivial_
10. API doc comment and MD creation _-- Super Trivial_
11. Front end
12. Suggestions engine (v3) _-- Trivial_
