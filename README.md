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

## Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built with Tailwind
- **Additional Libraries**:
  - `@headlessui/react` - For accessible UI components
  - `@heroicons/react` - For icons
  - `@tailwindcss/forms` - For form styling

## Getting Started

### Prerequisites

- Node.js version 18.18.0 or higher
- npm or yarn

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

3. Add image files
Place the following images in the `/public` directory:
- hero-image.jpg
- tutor-image.jpg
- testimonial-1.jpg
- testimonial-2.jpg
- testimonial-3.jpg

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable UI components
  - `/ui` - Basic UI components (Button, Card, Input)
  - `/layout` - Layout components (Header, Footer, MainLayout)
- `/src/lib` - Utility functions and helpers
- `/public` - Static assets

## Future Enhancements

- User authentication and authorization
- Payment processing integration
- Course content delivery system
- Tutor scheduling and booking
- Reviews and ratings system
- Admin dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.
