import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import MoviesContextProvider from '../contexts/moviesContext';
import { AuthProvider } from '../contexts/authContext';
import { PlaylistProvider } from '../contexts/playlistContext';
import { Card, CardContent, Typography, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const queryClient = new QueryClient();

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

interface Playlist {
  Id: number;
  Title: string;
  Description: string;
  CreatedDate: string;
  Movies: Movie[];
}

const samplePlaylists: Playlist[] = [
  {
    Id: 1,
    Title: 'My Favorite Movies',
    Description: 'A collection of my all-time favorite movies',
    CreatedDate: '2023-05-10',
    Movies: [
      {
        id: 337404,
        title: 'Cruella',
        poster_path: '/rTh4K5uw9HypmpGslcKd4QfHl93.jpg',
        release_date: '2021-05-26',
      },
      {
        id: 508943,
        title: 'Luca',
        poster_path: '/jTswp6KyDYKtvC52GbHagrZbGvD.jpg',
        release_date: '2021-06-17',
      }
    ]
  },
  {
    Id: 2,
    Title: 'Watch Later',
    Description: 'Movies I want to watch soon',
    CreatedDate: '2023-06-15',
    Movies: [
      {
        id: 550988,
        title: 'Free Guy',
        poster_path: '/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg',
        release_date: '2021-08-11',
      }
    ]
  }
];

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <Card sx={{ maxWidth: 345, mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {playlist.Title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {playlist.Description}
        </Typography>
        
        <Typography variant="caption" display="block" sx={{ mb: 2 }}>
          Created: {new Date(playlist.CreatedDate).toLocaleDateString()}
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Movies ({playlist.Movies.length})
        </Typography>
        
        <List dense>
          {playlist.Movies.map((movie: Movie) => (
            <React.Fragment key={movie.id}>
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ width: 40, height: 60, mr: 2, overflow: 'hidden' }}>
                    <img 
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138'} 
                      alt={movie.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <ListItemText 
                    primary={movie.title} 
                    secondary={`Released: ${new Date(movie.release_date).toLocaleDateString()}`} 
                  />
                </Box>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<PlaylistAddIcon />}
          >
            Add Movie
          </Button>
          <Button 
            variant="contained" 
            size="small"
            color="primary"
          >
            View All
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

interface PlaylistListProps {
  playlists: Playlist[];
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Playlists
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<PlaylistAddIcon />}
        >
          Create Playlist
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {playlists.map((playlist: Playlist) => (
          <Box key={playlist.Id} sx={{ width: { xs: '100%', sm: '48%', md: '31%' } }}>
            <PlaylistCard playlist={playlist} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const meta: Meta<typeof PlaylistList> = {
  title: 'Playlists/PlaylistList',
  component: PlaylistList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <MoviesContextProvider>
              <PlaylistProvider>
                <Story />
              </PlaylistProvider>
            </MoviesContextProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlaylistList>;

export const Basic: Story = {
  args: {
    playlists: samplePlaylists,
  },
};

export const EmptyPlaylists: Story = {
  render: () => (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Playlists
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<PlaylistAddIcon />}
        >
          Create Playlist
        </Button>
      </Box>
      
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          You don't have any playlists yet.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Create a playlist to organize your favorite movies.
        </Typography>
      </Box>
    </Box>
  ),
};

export const SinglePlaylistCard: Story = {
  render: () => <PlaylistCard playlist={samplePlaylists[0]} />,
};
