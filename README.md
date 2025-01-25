# Welcome to Remix!
- [Remix Docs](https://remix.run/docs)
## Development

The Remix dev server starts your app in development mode, rebuilding assets on file changes. To start the Remix dev server:

```sh
npm run dev
```
## Auth Flow
This uses MFA. New users must sign up with a password and email. New logins require the user to check their email for login code. If there is a failed attempt with submitting a login code, the user is notified with an email. A user can also change their password, as long as they prove they know their old password. When the password is successfully changed the user is notified with an email that the password was changed. 

## Deployment

I recommend Google Cloud Run, since the package json and the remix config is setup with remix-run/serve to make it good to go.
This video explains how to deploy using your terminal:
https://youtu.be/eemS-UTjdb0?si=2YJe8yiZsodQGxEn

- To Get gcloud: [gcloud tar](https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-darwin-arm.tar.gz)

```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
```

## Environment Variables
PG_PROMISE_CONNECTION_VARIABLES

<details>Author: David Paquette</details>