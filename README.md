# mean-auth

This project is used as a starting point for bootstrapping MEAN (MongoDB, ExpressJS, AngularJS, NodeJS) applications with authentication. HTTP requests are validated using JSON Web Tokens (JWT).

## Usage
1.Rename config.sample.js to config.js. From the project root directory run:
```
mv ./server/config.sample.js ./server/config.js
```

2.Start the server by going to the project root and running:
```
    npm start
```

3.Navigate to http://localhost:7000 in your web browser.

## API Keys
Here is how to obtain the client id and secret for each passport strategy.

### Google
1. Navigate to https://cloud.google.com/console/project
2. Click "Create Project" and fill out the Project details.
3. Click on the new project and navigate to APIs & auth > Credentials
4. Click "Create New Client Id"
..* Application Type: Web application
..* Authorized Javascript origins: [YOUR APP URL]
..* Authorized redirect URI: [YOUR GOOGLE CALLBACK URL]
