# TutorTrend - E-Commerce Educational Platform

TutorTrend is a modern e-commerce educational platform that combines online course marketplaces with local tutor-matching services. This platform provides a seamless experience for students to find and purchase courses or connect with tutors for personalized learning.

## Features

- **Dual Marketplace System**
  - Online Course Marketplace
  - Local Tutor Matching Service
- **User-friendly Interface**
  - Clean, modern design
  - Responsive layout for all devices
- **Comprehensive Search and Filtering**
  - Find courses by category, price, rating
  - Find tutors by location, subject, availability
- **User Dashboards**
  - Student dashboard
  - Tutor dashboard
- **Payment Processing**
  - Secure checkout with Stripe
  - Order management and verification

## Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built with Tailwind
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **Additional Libraries**:
  - `@headlessui/react` - For accessible UI components
  - `@heroicons/react` - For icons
  - `@tailwindcss/forms` - For form styling

## Getting Started

### Prerequisites

- Node.js version 18.18.0 or higher
- npm or yarn
- Docker and Docker Compose (for PostgreSQL database)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/tutor-trend.git
cd tutor-trend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
   - Copy the `.env.example` file to `.env.local`
   - Update the values in `.env.local` with your configuration
   - Make sure to set up Stripe API keys for payment processing

4. Start the PostgreSQL database with Docker
```bash
docker-compose up -d
```

5. Run database migrations and seed the database
```bash
npx prisma migrate dev
npx prisma db seed
```

6. Add image files
Place the following images in the `/public` directory:
- hero-image.jpg
- tutor-image.jpg
- testimonial-1.jpg
- testimonial-2.jpg
- testimonial-3.jpg

7. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable UI components
  - `/ui` - Basic UI components (Button, Card, Input)
  - `/layout` - Layout components (Header, Footer, MainLayout)
- `/src/lib` - Utility functions and helpers
  - `/repositories` - Database access layer
  - `/services` - Business logic services
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Key Features Implemented

- User authentication with NextAuth.js
- Course browsing and filtering
- Shopping cart functionality
- Secure checkout with Stripe
- Order management and verification
- User dashboard with purchased courses
- Responsive design for all devices

## Future Enhancements

- Course content delivery system
- Tutor scheduling and booking
- Reviews and ratings system
- Admin dashboard
- Analytics and reporting

## License

This project is licensed under the MIT License - see the LICENSE file for details.
