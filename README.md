# mean-auth

This project is used as a starting point for bootstrapping MEAN (MongoDB, ExpressJS, AngularJS, NodeJS) applications with authentication. HTTP requests are validated using JSON Web Tokens (JWT).

## Usage
Rename config.sample.js to config.js. From the project root directory run:
```
mv ./server/config.sample.js ./server/config.js
```
Install project dependencies
```
npm install
bower install
```

Start the server by going to the project root and running:
```
npm start
```

Navigate to http://localhost:7000 in your web browser.

## OAuth Setup
Here is how to obtain the client id and secret for each passport strategy.

### Google
1. Navigate to https://cloud.google.com/console/project
2. Click "Create Project" and fill out the Project details.
3. Click on the new project and navigate to APIs & auth > Credentials
4. Click "Create New Client Id"
  - Application Type: Web application
  - Authorized Javascript origins: [YOUR APP URL]
  - Authorized redirect URI: [YOUR GOOGLE CALLBACK URL]

### Salesforce

### Github

### Twitter
