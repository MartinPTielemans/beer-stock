# Beer Stock - Dynamic Bar Pricing System

This application simulates a stock market for bar products. It allows bartenders to:

- Log sales of various drinks and products
- Watch prices dynamically rise and fall based on real-time demand
- Visualize sales and price trends over time

## How It Works

The Beer Stock system uses a dynamic pricing algorithm that adjusts prices based on:

- Current demand (recent purchase volume)
- Time factors (happy hour, day of week, etc.)
- Historical sales data

As products become more popular, their prices automatically increase. When demand decreases, prices gradually fall.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Reusable UI components
- [Recharts](https://recharts.org/) - Charting library for visualizing data
- [Bun](https://bun.sh/) - JavaScript runtime and package manager

## Getting Started

This project uses [Bun](https://bun.sh/) instead of npm. First, make sure you have Bun installed:

```bash
# Install Bun (if you don't have it already)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Key Features

- **Dynamic Pricing**: Prices automatically adjust based on demand
- **Real-time Updates**: See price changes as sales are recorded
- **Historical Data**: Track price changes over time
- **Category Filtering**: View products by category
- **Visual Indicators**: Price direction and percentage change indicators

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
