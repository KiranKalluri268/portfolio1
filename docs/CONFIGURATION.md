# Configuration

## Environment setup

Copy the committed example before local development:

```bash
cp .env.example .env.local
```

`.env.local` must remain uncommitted.

## Contact form

### `RESEND_API_KEY`

Required for email delivery. Create the key in the Resend dashboard. It is read only in `src/app/api/contact/route.ts` and must never use a `NEXT_PUBLIC_` prefix.

### `CONTACT_EMAIL`

Required for email delivery. Every valid contact submission is sent to this address.

### `RESEND_FROM_EMAIL`

Optional sender identity. Until a domain is verified, use the Resend onboarding sender:

```dotenv
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
```

For production, verify a domain in Resend and replace it with an address on that domain.

The visitor's email is assigned as `reply_to`, allowing a direct reply from the destination inbox.

## Contact limits

The API accepts:

- Name: 1–100 characters
- Valid email: up to 254 characters
- Message: 1–5,000 characters
- Five accepted attempts per IP during a ten-minute window before a `429` response

The current limiter uses process memory. Serverless instances do not share this map, and deployments reset it. Use a managed store such as Redis if stronger abuse protection is needed.

## Editable portfolio data

### About

Edit `src/data/about.json`. Preserve valid JSON and keep emphasis ranges aligned with the desired copy.

### Résumé

Edit `src/data/resume.json`. Both `/resume` and the downloaded PDF consume this file, so content remains synchronized.

### Homepage projects and experience

These currently live in:

- `src/components/projects.tsx`
- `src/components/ExperienceTimeline.tsx`

Use optimized images from `public/images` and provide specific repository/demo URLs where available.

## Site identity and SEO

Canonical site information is currently defined in:

- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/opengraph-image.tsx`

When changing domains, update every canonical occurrence and the generated social image URL. The Open Graph renderer reads local Tektur TTF files from `public/fonts` and uses the deployed black-hole image URL.

## Media

- Main audio: `public/audio/final.mp3`
- Safari alpha video: `public/images/optimized_safari.mov`
- WebM alpha video: `public/images/optimized.webm`
- Static black-hole image: `public/images/blackhole.png`

Keep both transparent video formats unless browser support requirements change. Large media should be optimized before committing.

## Fonts

The application uses `next/font/google` for Foldit and Tektur. The social image renderer cannot consume those generated WOFF2 URLs directly, so it embeds the committed static Tektur TTF files in `public/fonts`.
