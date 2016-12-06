# GCE Mapcat Server

## Dependencies

- NodeJS
- NPM

## Environment Variables

Certain environment variables are required to run the server and access data. These should be provided for you and you should place them in a file called `.env` in the root of the repository.

## Working with the Server and Data Locally

In order to run the server locally, you must follow these steps:

- Clone the repository
- Run `npm install` once you've installed any global dependencies above.
- Add any environment variables above.
- Start the crate server locally with `ssh -L 4200:localhost:4200 [USERNAME]@[IP_ADDRESS]`.
- Verify it's working by visiting `http://localhost:4200`.
- Run `node server.js`.
- Verify it's working by visiting `http://localhost:3911/`.

To test that a query is available, visit something like `http://localhost:3911/?lat=37.7557675&long=-122.4246298&q=pizza`.
