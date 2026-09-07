This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Order notifications & daily kitchen summary

Every paid order emails `ORDERS_NOTIFICATION_EMAIL` immediately (see `src/lib/email.ts`) — point that address at a mailbox the kitchen/office checks on their phone, and it acts as the order feed.

For an end-of-day printable roster (every child's pickup code, grouped by school and grade, for the next school day), set `CRON_SECRET` in `.env` and schedule a daily GET request to:

```
https://<your-domain>/api/cron/daily-summary?secret=<CRON_SECRET>
```

A free service like [cron-job.org](https://cron-job.org) works well — trigger it once a day after parents are done ordering (e.g. 20:00). It emails the same `ORDERS_NOTIFICATION_EMAIL` a summary the kitchen can print and check kids off against by code or by name + grade the next morning.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
