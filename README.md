# Verbum

Verbum is a mobile language learning application built with React Native and Expo. Learn new languages through interactive quizzes, daily challenges, and a gamified points system.

## Features

- **Interactive Quizzes**: Test your knowledge with multiple-choice quizzes
- **Points System**: Earn points as you learn to track your progress
- **Daily Streaks**: Maintain your learning streak for additional rewards
- **Mission System**: Complete missions to earn bonus points
- **User Profiles**: Track your achievements and statistics
- **Multiple Languages**: Support for various language learning paths

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/verbum.git
cd verbum
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up your Firebase configuration
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase configuration to the app

4. Start the development server
```bash
npx expo start
```

## Core Concepts

### Quizzes
Quizzes are the primary learning method in Verbum. Each quiz presents words in your target language and asks you to select the correct translation.

### Points
Users earn points by completing quizzes, missions, and maintaining streaks. Points are displayed on your profile.

### Streaks
Maintaining a daily streak encourages consistent learning. The app tracks how many consecutive days you've practiced.

### Missions
Complete special challenges like "Learn 10 new words" or "Complete 3 lessons" to earn bonus points.

## Project Structure

- `/app` - Main application code
  - `/components` - Reusable UI components
  - `/services` - Business logic and API services
  - `/tabs` - Main navigation tabs and screens
- `/assets` - Static assets and images
- `/lib` - Utility functions and helpers

## Firebase Collections

The app uses the following Firestore collections:
- `userInfo` - User profiles and progress
- `quizzes` - Quiz content and metadata
- `missions` - Mission definitions and rewards
