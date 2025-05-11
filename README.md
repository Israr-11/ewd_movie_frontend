---
## Enterprise Web Development module - Frontend Development with React+Vite.
---

**Name:** Israr Ahmed

**Demo:** [View Demo]()

---

## Overview

MovieFest is a comprehensive movie browsing and management application built with React, TypeScript, and Material UI. The application allows users to explore movies, TV series, and actors from TMDB (The Movie Database), create personalized playlists, manage favorite movies, write reviews, and even create fantasy movies.

## Deployment

The application has been deployed using AWS infrastructure through CDK (Cloud Development Kit). The React-based movie web application is hosted in an S3 bucket as static files, distributed globally via CloudFront CDN for improved performance and security, and made accessible through the custom domain "moviefest.sbs" configured with Route 53 DNS service. The deployment includes SSL certification for HTTPS security.

## Features

- **Movie Discovery**: Browse popular and upcoming movies with detailed information  
- **TV Series**: Explore popular TV shows with season details and episode information  
- **Actor Profiles**: View detailed information about actors and their filmography  
- **User Authentication**: Register and login to access personalized features  
- **Favorites Management**: Add movies to favorites and manage your collection  
- **Custom Playlists**: Create and manage multiple movie playlists  
- **Movie Reviews**: Read and write reviews for movies  
- **Fantasy Movies**: Create your own fantasy movie entries with custom details, cast members, and posters 
- **Advanced Filtering**: Filter movies by title, genre, rating, year, and more  
- **Netflix-Inspired UI**: Dark theme with red accents for a modern streaming platform look  


## Technologies Used
- **React 18**: For building the user interface  
- **TypeScript**: For type safety and better developer experience  
- **React Router**: For navigation and routing  
- **React Query**: For efficient data fetching and caching  
- **Material UI**: For consistent and responsive UI components  
- **Context API**: For state management across the application  
- **Vite**: For fast development and optimized builds  

## Project Structure

```bash
src/
├── api/                         # API integration with TMDB and custom CDK backend services
├── components/                  # Reusable UI components
│   ├── cardIcons/              # Action icons for movie cards
│   ├── footer/                 # Application footer
│   ├── movieCard/             # Movie card component
│   ├── movieDetails/          # Movie details display
│   ├── movieFilterUI/         # Filtering interface for movies
│   ├── movieList/             # List of movie cards
│   ├── movieReviews/          # Movie reviews component
│   ├── playlist/              # Playlist management components
│   ├── reviewForm/            # Form for submitting reviews
│   ├── siteHeader/            # Application header with navigation
│   └── templatePages/         # Page templates for consistent layouts
├── contexts/                   # React contexts for state management
│   ├── authContext.ts         # Authentication state
│   ├── moviesContext.ts       # Movies state
│   └── playlistContext.ts     # Playlist state
├── hooks/                      # Custom React hooks
├── images/                     # Static images
├── pages/                      # Application pages
│   ├── actorDetailsPage.tsx   # Displays detailed information about an actor including biography and filmography
│   ├── actorsPage.tsx         # Shows a grid of popular actors that users can browse through
│   ├── addMovieReviewPage.tsx # Form page allowing users to write and submit reviews for movies
│   ├── fantasyMovieDetailsPage.tsx # Displays details of user-created fantasy movies
│   ├── FantasyMoviePage.tsx   # Form page for creating or editing fantasy movies
│   ├── fantasyMoviesListPage.tsx # Lists all fantasy movies created by the user
│   ├── favouriteMoviesPage.tsx # Shows all movies marked as favorites by the user
│   ├── homePage.tsx           # Main landing page displaying popular movies with filtering options
│   ├── loginPage.tsx          # User authentication page for logging into the application
│   ├── movieDetailsPage.tsx   # Shows comprehensive details about a specific movie
│   ├── movieReviewPage.tsx    # Displays full text of a specific movie review
│   ├── playlistDetailsPage.tsx # Shows movies contained within a specific user playlist
│   ├── playlistsPage.tsx      # Lists all playlists created by the user
│   ├── registerPage.tsx       # User registration page for creating a new account
│   ├── tvSeriesDetailsPage.tsx # Displays detailed information about a TV series including seasons
│   ├── tvSeriesPage.tsx       # Shows a grid of popular TV series that users can browse
│   ├── upcomingMoviesPage.tsx # Displays movies that are coming soon to theaters
├── stories/                    # Storybook stories for components
├── types/                      # TypeScript type definitions
└── utils/                      # Utility functions

```

## Key Implementation Details

### Authentication System
The application features a complete authentication system with:
- User registration and login
- Protected routes for secure access
- User data securely stored and managed through the `AuthContext`

### State Management
MovieFest uses **React Context API** for centralized state management:
- **AuthContext**: Manages user authentication state
- **MoviesContext**: Handles movie data, favorites, and reviews
- **PlaylistContext**: Manages user-created playlists

### API Integration
- Integrates with the **TMDB API** to fetch movie, TV series, and actor data.
- Connects to a **custom backend** for user-specific features like:
  - Favorites
  - Playlists
  - Fantasy movies

### Advanced Filtering
The **Home Page** includes a powerful filtering system that lets users:
- Search by movie title
- Filter by genre
- Filter by rating
- Filter by release year
- Sort by various criteria (popularity, rating, release date)

### Fantasy Movies Feature
Users can create their own custom "fantasy" movie entries with:
- Custom titles, descriptions, and release dates
- Genre selection
- Runtime and rating settings
- Poster image uploads
- Cast member management
