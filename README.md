# [WORLD CLEANER](https://world-cleaner.herokuapp.com)

![Heroku](http://heroku-badge.herokuapp.com/?app=world-cleaner&style=flat&svg=1)

This website was created as a personal project while following the [Start2Impact](https://www.start2impact.it/) development course.
The requirements were:

- A POST endpoint to report polluted places, providing infos about the location and a photo, uploaded using multer.
- A GET endpoint to fetch a list of all reported places.
- Optional: a graphical interface client-side.

After completing them, I decided to create the PATCH and DELETE endpoint to make the API completely RESTful, and then went on adding more features: the possibility to clean up and mark a place as cleaned, basic authentication and a front-end client built with React, thus creating my first full-stack MERN application.

## BACKEND

The server is built using Node.js and the Express framework. I used ES6 import syntax in node as well for consistency and the [colors](https://www.npmjs.com/package/colors 'colors') package to improve messages to the development console.

#### DB configuration

The mongoDB [configuration file](https://github.com/lucabettini/worldcleaner/blob/main/config/db.js 'configuration file') is stored on the /config folder, while the db schema in [/models.](https://github.com/lucabettini/worldcleaner/tree/main/models '/models.') I created two models, one for infos about places, with a nested 'cleaned' property, and another for basic authentication and user information. Routes and controllers are separated into different folders and are actually 4, two for placeModel (general infos and cleaning infos) and two for userModel (general CRUD operation on users and more advanced authentication).

#### API

Below is a simple schema of API endpoints:

|        | ROUTE               | CONTROLLER      | ACTION                          |
| ------ | ------------------- | --------------- | ------------------------------- |
| GET    | /api/places         | placeController | Fetch all places list           |
| POST   | /api/places         | placeController | Add a new place                 |
| GET    | /api/places/:id     | placeController | Fetch infos about a place       |
| PATCH  | /api/places/:id     | placeController | Edit a place                    |
| DELETE | /api/places/:id     | placeController | Delete a place                  |
| POST   | /api/clean/:id      | cleanController | Mark a place as cleaned         |
| PATCH  | /api/clean/:id      | cleanController | Edit cleaning infos             |
| DELETE | /api/clean/:id      | cleanController | Delete cleaning infos           |
| GET    | /api/users          | userController  | Fetch all users list            |
| POST   | /api/users          | userController  | Register a new user             |
| GET    | /api/users/:id      | userController  | Fetch infos about a single user |
| PATCH  | /api/users/:id      | userController  | Edit user infos                 |
| DELETE | /api/users/:id      | userController  | Delete account                  |
| POST   | /api/login          | authController  | Login user                      |
| POST   | /api/logout         | authController  | Logout user                     |
| POST   | /api/forgotPassword | authController  | Send email to reset password    |
| PATCH  | /api/resetPassword  | authController  | Change forgotten password       |
| PATCH  | /api/changePassword | authController  | Change password while loggedin  |

#### FILE STORAGE

Since Heroku does not support static file storage, I decided to use AWS. All images uploaded by the user (compressed on the client-side) are sent to a S3 bucket using [multer](https://www.npmjs.com/package/multer 'multer') and [multerS3](https://www.npmjs.com/package/multer-s3 'multerS3'). This logic is contained into his own [middleware](https://github.com/lucabettini/worldcleaner/blob/main/middleware/multerMiddleware.js 'middleware').

#### ERROR HANDLING

I used [express-async-handler](https://www.npmjs.com/package/express-async-handler 'express-async-handler') instead of multiple try/catch block and a custom [error middleware](https://github.com/lucabettini/worldcleaner/blob/main/middleware/errorMiddleware.js 'custom error middleware'). This allowed me to directly throw errors inside the controller whenever validation or authentication failed and to catch DB errors as well. Using a list of messages, the middleware chooses the correct status code and send the response with a message that is used by the client to show a toast or redirect the user to an error page.

#### SECURITY

After long research, I decided to use JWT tokens stored inside a secure, same-site and http-only session cookie. This choice is pratical - the token is sent automatically with every request and on logout the cookie is simply removed, without having to maintain a black list of revokjed token in the DB - and allows for a decent level of security, since the token is not directly saved on local storage and the cookie cannot be manipulated on the client-side, being http-only. This logic is contained inside the custom [auth middleware](https://github.com/lucabettini/worldcleaner/blob/main/middleware/authMiddleware.js 'auth middleware').

HTTP security headers are set using [helmet](https://www.npmjs.com/package/helmet 'helmet'). All requests are sanitized using [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize 'express-mongo-sanitize') and [xss-clean](https://www.npmjs.com/package/xss-clean 'xss-clean') and then validated in the controllers either manually or using the[ express-validation ](https://www.npmjs.com/package/express-validation ' express-validation ')package. Requests from the same IP are limited to 200/hr using [express-rate-limit](https://www.npmjs.com/package/express-rate-limit 'express-rate-limit.'). All passwords are hashed using[ bcryptjs](https://www.npmjs.com/package/bcryptjs ' bcryptjs') before being saved in the database.

## FRONTEND

The frontend is built using the latest version React (17.0.1), with functional components and React Hooks instead of class component (a part from the [Error Boundary](https://github.com/lucabettini/worldcleaner/blob/main/client/src/components/ErrorBoundary.js 'Error Boundary') component, that doesn't have an alternative with hooks).

[Redux](https://redux.js.org/ 'Redux') is used as a state manager for mantaining a global list of places, otherwise all other resources are fetched from the API using axios inside useEffect hooks.

#### LAYOUT

I used [materialize-css](https://materializecss.com/ 'materialize-css') as a CSS framework, realising only considerably late that it was a poor choice, since some components did not render as expected in production. To fix this issue I re-applied some classes and properties manually, both inside the components as inline styles and inside my [main stylesheet file](https://github.com/lucabettini/worldcleaner/blob/main/client/src/styles/style.scss 'main stylesheet file'). I also tweaked the behavior of materialize checkbox inside the [ListScreen component](https://github.com/lucabettini/worldcleaner/blob/main/client/src/components/screens/ListScreen.js 'ListScreen component'), to use it as a radio input while maintaing his appearance.

The regular user can navigate across 5 major screens (16 if counting forms and the error screen), create an account, edit his profile infos, add places or cleaning infos (and edit and deleting them as well). A simple admin dashboard was provided.

#### FORMS

Forms are show on separate screen with the same basic layout. All forms are controlled components, except for those that edit informations already present on the server, where refs were used to get changes on the default values provided with an API call. Uploaded files are validated and compressed using [browser-image-compression](https://www.npmjs.com/package/browser-image-compression 'browser-image-compression') before being sent to the server (see [example](https://github.com/lucabettini/worldcleaner/blob/main/client/src/components/forms/place/PlaceForm.js 'example')).

#### CUSTOM HOOKS

Real authentication happens on the server: the [useCredentials hook](https://github.com/lucabettini/worldcleaner/blob/main/client/src/hooks/useCredentials.js 'useCredentials hook') is merely a way to prevent the non-malicious user to view pages not intended for him or her. After login, the user ID or admin credentials, contained in the response, are saved on session storage. Every protected page or button uses this information to hide itself or redirect to a different page. Upon logout, this hooks remove the ID from session storage and makes a request to the server to remove the session cookie as well, then redirects to the homepage.

The [useError hook](https://github.com/lucabettini/worldcleaner/blob/main/client/src/hooks/useError.js 'useError hook') sorts all the errors thrown inside components or by axios if a request to the server fails. Then, either displays a toast to the user (and additional infos in console if in development mode) or dispatches the thrownError function to the reducer, changing the global state. The [ErrorCather component](https://github.com/lucabettini/worldcleaner/blob/main/client/src/components/ErrorCatcher.js 'ErrorCather component') listens to this kind of state changes, redirecting the user immediately to the [ErrorScreen component](https://github.com/lucabettini/worldcleaner/blob/main/client/src/components/screens/ErrorScreen.js 'ErrorScreen component'), where the state is resetted to its initial state. Findally, the [Error Boundary](https://github.com/lucabettini/worldcleaner/blob/main/client/src/components/ErrorBoundary.js 'Error Boundary') included in index.js catches all other kinds of errors, including those happening on the Redux store.

#### CREDITS

Map is built using [Leaflet](https://leafletjs.com/ 'Leaflet') and [OpenStreetMap](https://www.openstreetmap.org/copyright 'OpenStreetMap'). Icons from [Material Design](https://materializecss.com/icons.html 'Material Design'), fonts by [Google Fonts](https://fonts.google.com/ 'Google Fonts'). The main logo is from [Freepik](https://it.freepik.com/ 'Freepik').

---

Made by [Luca Bettini](https://lucabettini.github.io/).
