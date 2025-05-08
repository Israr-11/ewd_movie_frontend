import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import FavouriteMoviesPage from "./pages/favouriteMoviesPage"; 
import MovieReviewPage from "./pages/movieReviewPage";
import SiteHeader from './components/siteHeader'
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import MoviesContextProvider from "./contexts/moviesContext";
import { AuthProvider } from "./contexts/authContext";
import AddMovieReviewPage from './pages/addMovieReviewPage';
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProtectedRoute from "./components/protectedRoutes";
import { PlaylistProvider } from "./contexts/playlistContext";
import PlaylistsPage from "./pages/playlistsPage";
import PlaylistDetailsPage from "./pages/playlistDetailsPage";
import FantasyMoviesListPage from "./pages/fantasyMoviesListPage";
import CreateFantasyMoviePage from "./pages/FantasyMoviePage";
import FantasyMovieDetailsPage from "./pages/fantasyMovieDetailsPage";
import ActorsPage from "./pages/actorsPage";
import ActorDetailsPage from "./pages/actorDetailsPage";
import TVSeriesPage from "./pages/tvSeriesPage";
import TVSeriesDetailsPage from "./pages/tvSeriesDetailsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000, 
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <SiteHeader />
          <MoviesContextProvider>
            <PlaylistProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<MoviePage />} />
                <Route path="/reviews/:id" element={<MovieReviewPage />} />
                <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
                <Route path="/actors" element={<ActorsPage />} />
<Route path="/actors/:id" element={<ActorDetailsPage />} />
<Route path="/tv" element={<TVSeriesPage />} />
<Route path="/tv/:id" element={<TVSeriesDetailsPage />} />
                {/* Protected routes */}
                <Route 
                  path="/movies/favourites" 
                  element={
                    <ProtectedRoute>
                      <FavouriteMoviesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/movies/playlists" 
                  element={
                    <ProtectedRoute>
                      <PlaylistsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/movies/playlists/:id" 
                  element={
                    <ProtectedRoute>
                      <PlaylistDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reviews/form" 
                  element={
                    <ProtectedRoute>
                      <AddMovieReviewPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fantasy Movie routes */}
                <Route 
                  path="/fantasy-movies" 
                  element={
                    <ProtectedRoute>
                      <FantasyMoviesListPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fantasy-movies/create" 
                  element={
                    <ProtectedRoute>
                      <CreateFantasyMoviePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fantasy-movies/:id" 
                  element={
                    <ProtectedRoute>
                      <FantasyMovieDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </PlaylistProvider>
          </MoviesContextProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
