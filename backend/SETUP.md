# Enable AI meal photos for Jaime's Path

The public GitHub Pages app is **client only**. This directory contains a separate Cloudflare Worker that privately calls the OpenAI Responses API. This integration is **not active** until you configure and deploy it.

## From an iPhone, using Cloudflare's dashboard
1. Visit [Cloudflare Workers & Pages](https://dash.cloudflare.com/) in Safari. Sign up or log in.
2. Create a Worker named `jaimes-path-photo`. Edit its source code and replace the template with the exact contents of `photo-worker.js` from this repository. Deploy.
3. Create a Workers KV namespace such as `JAIMES_PATH_USAGE`. Add a KV binding to the Worker with variable name **USAGE**, pointing at that namespace. The Worker refuses processing without KV (fail-closed).
4. In the Worker's Settings → Variables and Secrets, add secrets (not plaintext source variables):
   - `OPENAI_API_KEY`: a restricted OpenAI API project key, created in your [OpenAI API dashboard](https://platform.openai.com/api-keys). ChatGPT subscription access does not itself include API usage.
   - `PHOTO_ACCESS_CODE`: a unique randomly generated, long access code used to authorize Jaime's phone. Use a password-manager-generated code of at least 32 random characters. **Do not paste it into GitHub**.
   - Optional plain variable `OPENAI_MODEL`: `gpt-4.1-mini` or another Responses API image-capable model verified in your OpenAI project.
5. Redeploy if necessary and note the HTTPS Worker URL, for example `https://jaimes-path-photo.<your-subdomain>.workers.dev`.
6. In Jaime's Path → Settings → AI Photo Recognition, enter `https://jaimes-path-photo.<your-subdomain>.workers.dev/analyze` and your private `PHOTO_ACCESS_CODE`. Save.
7. Photograph a meal, tap Analyze, review all estimated nutrition, and **save only after correcting uncertain estimates**.

## Security and cost controls
- Source repository and GitHub Pages are public. **Never commit credentials** to either.
- OpenAI requests run only inside the Worker using a server-side secret. Photos are passed to OpenAI as image inputs, not saved by Jaime's Path backend.
- Worker allows only the origin `https://lazythomas.github.io` with CORS; CORS is not authentication. All billable requests require the private access code.
- Access code is retained in browser **sessionStorage**, not persistent storage. Jaime may need to enter it again after restarting Safari or the PWA.
- KV imposes a basic limit of 20 attempted photos daily per client IP, but KV is eventually consistent; also turn on platform rate limiting, configure OpenAI project usage limits and alerts, and review billing.
- Do not send personally identifying or sensitive health information in images. Read applicable OpenAI API data policies before use.
- The Worker is a starting integration, not independently security-audited or end-to-end tested. A publicly deployed PWA is not a replacement for a private authenticated user account.

## Expected JSON response
```json
{"foods":[{"name":"Chicken","calories":240,"protein":40,"carbs":0,"fat":6}],"disclaimer":"..."}
```
There are no guaranteed accurate photo-only calorie or gram estimates.

## If it fails
- 401: Incorrect access code.
- 403: Browser origin is not the configured GitHub Pages origin.
- 429: Local daily quota reached or OpenAI service limit.
- 502: OpenAI error or invalid response.
- 503: Missing Cloudflare secrets or KV binding.

You can continue manual tracking without using photos.
