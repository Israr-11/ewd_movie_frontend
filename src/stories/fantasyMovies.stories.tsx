import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import MoviesContextProvider from '../contexts/moviesContext';
import { AuthProvider } from '../contexts/authContext';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button } from '@mui/material';

// Create a new QueryClient for the stories
const queryClient = new QueryClient();

// Sample fantasy movie data
const sampleFantasyMovie = {
  Id: 1,
  UserId: 'user123',
  Title: 'My Fantasy Adventure',
  Overview: 'A thrilling adventure in a magical world where dreams come true and heroes are born.',
  Genres: ['Adventure', 'Fantasy', 'Action'],
  ReleaseDate: '2023-12-25',
  Runtime: 142,
  ProductionCompanies: ['Dreamworks Studios', 'Fantasy Films'],
  PosterUrl: 'https://via.placeholder.com/500x750',
  Cast: [
    { Name: 'John Smith', Role: 'Hero', Description: 'The main protagonist' },
    { Name: 'Jane Doe', Role: 'Sidekick', Description: 'Loyal friend and helper' },
    { Name: 'Robert Johnson', Role: 'Villain', Description: 'The evil mastermind' }
  ],
  CreatedDate: '2023-05-15'
};

// Fantasy Movie Card Component for the story
const FantasyMovieCard = ({ movie }: { movie: { 
  Id: number;
  UserId: string;
  Title: string;
  Overview: string;
  Genres: string[];
  ReleaseDate: string;
  Runtime: number;
  ProductionCompanies: string[];
  PosterUrl: string;
  Cast: Array<{ Name: string; Role: string; Description: string; }>;
  CreatedDate: string;
} }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="400"
        image={movie.PosterUrl}
        alt={movie.Title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {movie.Title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {movie.Overview.length > 100 ? `${movie.Overview.substring(0, 100)}...` : movie.Overview}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {movie.Genres.map((genre) => (
            <Chip key={genre} label={genre} size="small" />
          ))}
        </Box>
        
        <Typography variant="body2">
          Release Date: {new Date(movie.ReleaseDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          Runtime: {movie.Runtime} minutes
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button variant="contained" color="primary" fullWidth>
          View Details
        </Button>
      </Box>
    </Card>
  );
};
const meta: Meta<typeof FantasyMovieCard> = {
  title: 'Fantasy Movies/FantasyMovieCard',
  component: FantasyMovieCard,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <MoviesContextProvider>
              <Story />
            </MoviesContextProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FantasyMovieCard>;

// Basic fantasy movie card story
export const Basic: Story = {
  args: {
    movie: sampleFantasyMovie,
  },
};

// Fantasy movie with many genres
export const ManyGenres: Story = {
  args: {
    movie: {
      ...sampleFantasyMovie,
      Genres: ['Adventure', 'Fantasy', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Romance'],
    },
  },
};

// Fantasy movie with long title and overview
export const LongContent: Story = {
  args: {
    movie: {
      ...sampleFantasyMovie,
      Title: 'The Incredibly Long and Detailed Title of My Amazing Fantasy Adventure Movie That Will Blow Your Mind',
      Overview: 'This is an extremely long overview that goes into great detail about the plot, characters, and world of this fantasy movie. It contains many sentences and paragraphs that describe the epic journey of our heroes as they traverse magical lands, battle fearsome creatures, and ultimately save the world from certain doom. The story begins in a small village where our protagonist discovers they have special powers...',
    },
  },
};
