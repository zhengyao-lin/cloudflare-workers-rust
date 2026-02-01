# Cloudflare Workers Template

The template is using:
- Rust for both the server and frontend code
- [Leptos](https://leptos.dev/) and [Thaw UI](https://thawui.vercel.app/) as the frontend UI framework
- [Playwright](https://playwright.dev/) for testing

## Usage

First run `npm i` to install dependencies.

To locally test:
```
npm run dev
```

To deploy to Cloudflare Workers:
```
npm run deploy
```

Run Rust and Playwright integration tests:
```
npm run test
```

Run linter or formatter:
```
npm run lint
npm run fmt
```

## Auto-deployment

To enable auto-deployment on push to GitHub:
1. Create a [Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).
2. Add the token to a [GitHub secret](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets#creating-secrets-for-a-repository) with key `CLOUDFLARE_API_TOKEN`.
3. Uncomment the last section of `.github/workflows/ci.yml`.
