# Rest API for school database

> A simple REST API interface for a school/online course database.

This tool facilitates adding/updating/removing/reviewing course data within the database. The tool provides two endpoints: `/api/users` and `/api/courses` to help with this.

The users endpoint provides a POST route to add a new user to the system, and a GET route once you've logged in to allow you to review your own record.

The courses endpoint provides a GET route that will return all courses in the system, alternatively you make select a single course with `/api/courses/:id` where :id is the numerical id of the course. There is a POST route to which you may post a course. A PUT route to update a single course, and a DELETE route as well.

## Installation

```
git clone https://github.com/kalenhoneyfield/rest-api-with-db.git
cd ./rest-api-with-db
npm install --production
[npm run seed] This step is optional if you would like some example courses loaded into the database
npm start
```

## Development setup

If you would like to work with this and develop it further, I might suggest the following. While not required it will setup the dependencies for VS Code, Prettier, ESLint, sequelize-cli, and nodemon.

```
git clone https://github.com/kalenhoneyfield/rest-api-with-db.git
cd ./rest-api-with-db
npm install
[npm run seed] This step is optional if you would like some example courses loaded into the database
npm run nodemon
```

## Treehouse Specific Meta

- The GET `/api/users` route filters out the password, created, and updated fields
- Both of the GET `/api/courses` routes filter out the created and updated fields
- The PUT and DELETE `/api/courses/:id` routes return a 403 error if the user currently signed in isn't the user that created the course
- The POST `/api/users` route validates that email address provided is both unique and is in a valid email address format

## Meta

Kalen Honeyfield – [@KHoneyfield](https://twitter.com/khoneyfield) – kalenhoneyfield@gmail.com

[KalenHoneyfield@github](https://github.com/kalenhoneyfield/)
