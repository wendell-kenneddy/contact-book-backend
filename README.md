# Contact Book API

![Author](https://img.shields.io/badge/author-Wendell%20Kenneddy-brightgreen)
![Status](https://img.shields.io/badge/status-Concluded-brightgreen)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## 📕 About

A simple API for a contact book application.

## Technologies used

- Typescript
- ExpressJS
- Postgres
- Redis
- Esbuild
- Docker

## ⚒️ How to use

### Database

The postgres database has 2 entities: `users` and `contacts`. Each user can create, view, update and delete contacts, and upon user deletion, all of its contacts are also deleted.

To initialize the database, run `npx prisma migrate dev`.

Be sure to populate the `.env` files before running the application.

### Routes

The API has 3 main endpoints: `auth, users and contacts`. Below is a map of all available
operations. Routes marked with "protected" require authentication.

```
  users
    DELETE /me (protected) -> deletes own account
```

```
  contacts
    GET /contacts (protected) -> returns a page of contacts belonging to the user
    GET /contacts/:contactID (protected) -> returns a single contact, if it exists and belongs to the user
    POST /contacts (protected) -> creates a new contact
    PATCH /contacts/:contactID (protected) -> updates a single contact, if it exists and belongs to the user
    DELETE /contacts/:contactID (protected) -> deletes a single contact, if it exists and belongs to the user
```

```
  auth
    POST /login -> performs login, returning an access token and a refresh token
    POST /signup -> creates a new user, also returning an access token and a refresh token
```

### Caching

To prevent unnecessary queries into the DB when no data has changed, the returned page from the /contacts endpoint
is cached. On future requests, if the requested resource is present in cache, it will be returned from it, otherwise
the DB will be queried and the data will be cached. When the user creates, updates or deletes a contact, the cache for
this specific user is invalidated. Redis is used as cache.

### Authentication

To access a protected route, an Access Token is required, by appending it to the Authorization header.

`Authorization: Bearer <access_token>`.

The access token has a short lifespan, so to ensure the user doesn't need to login often, a refresh token also must be used, by appending it into the `refresh-token cookie`. Both tokens are provided when a user access the login/signup routes.

The general flow is as follows:

- User performs login -> access token + refresh token provided.
- User access protected route by passing access token.
- After the access token expires, the passed refresh token is used to generate new access and refresh tokens.
- User saves the new access token, and tries to access the route again, this time successfully.
- When the refresh token expires, the user must perform login again.

## 🤝 How to contribute

Have any idea that can help boost the project, and want to share it? It's simple!

1. Fork the project
2. Modify what you want
3. Commit the changes
4. Open a Pull Request

## 🔓 License

This project is under license. Click [here](./LICENSE) for details.
