# Welcome to Remix!
- [Remix Docs](https://remix.run/docs)
## Development

The Remix dev server starts your app in development mode, rebuilding assets on file changes. To start the Remix dev server:

```sh
npm run dev
```
## Auth Flow
This uses MFA. New users must sign up with a username, password and email. Google is an Oauth2 provider.  Option after signing up, to login with your username+password or with Google.

## Deployment

I recommend Google Cloud Run, since the package json and the remix config is setup with remix-run/serve to make it good to go.
This video explains how to deploy using your terminal:
https://youtu.be/eemS-UTjdb0?si=2YJe8yiZsodQGxEn

- To Get gcloud: [gcloud tar](https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-darwin-arm.tar.gz)

```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
```

## Notes

- Placeholder

## Environment Variables

SUPABASE_URL=
SUPABASE_PUBLIC_KEY=
VITE_API_URL=
DOMAIN_URL=

<details>Author: David Paquette</details>