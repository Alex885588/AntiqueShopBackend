## Description

This application is for Scopic, allows antique item sellers to showcase their products for auction and allows registered users to bid on these items. Admin users have the capability to manage products, set up auctions, and monitor bids.

## Features

User Authentication: Users can register, login, and manage their profiles.
Product Management: Admin users can add, edit, and delete antique items for auction.
Auction Setup: Admin users can set up auctions for specific items, defining starting bid, auction duration, and other parameters.
Bidding System: Registered users can place bids on auctioned items, with bidding updates in real-time.
Notifications: Users receive notifications for important events such as outbidding or winning an auction.
Admin Dashboard: Admin users have access to a dashboard for monitoring auctions, managing products, and viewing bid history.


## Technologies Used

NestJS: Backend framework for building scalable and efficient server-side applications.
TypeScript: Provides static typing capabilities and improved developer experience.
PostgreSQL: Relational database for storing user profiles, product information, and bidding data.
WebSocket: Enables real-time bid updates and notifications for users.
JWT: JSON Web Tokens for secure authentication and authorization.
Swagger: API documentation for easy integration and understanding of endpoints.

## Installation

```bash
$ npm install
```

## Environment Configuration

PORT: The port on which the server will listen for incoming HTTP requests.
HOST: The host name or IP address where the server will bind to. 
DB_PORT: The port number where your database server is running. 
DB_USERNAME: The username used to authenticate with the database server.
DB_PASSWORD: The password used to authenticate with the database server.
DB_NAME: The name of the database you want to connect to.
JWT_SECRET: Secret key used to sign JSON Web Tokens (JWTs) for authentication. 
JWT_EXPIRES: The expiration time for JWT tokens.
EMAIL_SENDER: The email address from which emails will be sent.
EMAIL_PASS: The password or API key used to authenticate with the email service provider's SMTP server.
AWS_S3_REGION: The AWS region where your S3 bucket is located.
AWS_S3_ACCESS_KEY_ID: The Access Key ID used to authenticate with AWS for S3 operations.
AWS_S3_SECRET_KEY: The Secret Access Key used to authenticate with AWS for S3 operations.
AWS_S3_BUCKET: The name of the AWS S3 bucket where you want to store your files or assets.
  
## Running the seeder

```bash
$ npm run seed-ts
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit test
$ npm test
```

## Stay in touch

- Author - [Alexander Aleksanyan]
