# Budgeting App - Midtown 

## Remix - React Router Framework

### Description

A full-stack project that includes MFA login and sign up. A new user can use the `/yourdata` pages to make their budget plan. Users can see their bottom line and get help on more decisions with Google Gemini ai.  Remix provides React, Tailwind, Typescript, Nodejs, and vite build to make the development process very enjoyable.:
### Table of Contents
1. [Features](#features)
2. [Technologies](#technologies)
3. [Setup](#setup)
4. [Environment Variables](#environment-variables)
5. [Testing](#testing)
### Features
- MFA with JWT, Node mailer and a secure code to your inbox!
- Communication of password changes, and attempts to login to your account.
- Password hashing and old security codes cycled out.
- Password strength enforced.
- Pages that show profile information and budget data are protected routes. Invalid id's in params are redirected.
#### MFA
This uses MFA. New users must sign up with a password and email. New logins require the user to check their email for login code. If there is a failed attempt with submitting a login code, the user is notified with an email. A user can also change their password, as long as they prove they know their old password. When the password is successfully changed the user is notified with an email that the password was changed. If there is a failed attempt at logging in the user is notified.
#### Avoiding exploits
SQL table `auth_users` keeps a history of all emails used.
Verification codes are deleted after they have been used.
## Google Gemini Summary

When a user has some budgeting data, and a table associated with the data, the user can see this information on `/profile/id/yourdata`.  The svg "Generate Summary" will evaluate the disposable income you have and make a summary of what to do now based on the result of called the google gemini LLM.
### Technologies
- **Remix Framework** 
- **Vite and Nodejs** server and build
- **Google Cloud** deploy to gcloud with one command
- **Pupetter testing** Three tests that run a headless browser.
- **Typescript** Type safety in development.
- **React and Tailwind** Components and forms with these components.
### Setup
1. Clone the repository.
   ```bash
   git clone https://github.com/DaveP80/midtown-budgeting.git
   ```
2. Install dependencies.
   ```bash
   npm install
   ##Add environment variables
   npm run dev
   ```


## Deployment

I recommend Google Cloud Run, since the package json and the remix config is setup with remix-run/serve to make it good to go.
This video explains how to deploy using your terminal:
https://youtu.be/eemS-UTjdb0?si=2YJe8yiZsodQGxEn

- To Get gcloud: [gcloud tar](https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-darwin-arm.tar.gz)

```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
```
## Testing

Puppeteer (nodejs) is in the `/test` directory. This uses a headless browser to do interactions, end to end, on the local locally ran development server. `node index.js` is to run the 3 tests I have made. New tests can be made by encapsulating a testing function.
#### Test Runner
- **Unit Testing**: Run with Pupeteer.
  ```bash
  cd test
  npm install
  node index.js
  ```
#### Note on Testing
Add environment variables to help mock a user logging in with email and password.

## Environment Variables
PG_DATABASE=
PG_HOST=
PG_PORT=5432
PG_USER=
PG_PASSWORD=
JWT_TOKEN_SECRET_KEY=
EMAIL_ADD=
GENAI_API_KEY=

<details>Author: David Paquette</details>