import React, { useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { getMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
  ratingFilter,
  yearFilter,
} from "../components/movieFilterUI";
import { BaseMovieProps, DiscoverMovies } from "../types/interfaces";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';
import { Box, Button, styled, Typography } from "@mui/material";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};
const ratingFiltering = {
  name: "rating",
  value: "0",
  condition: ratingFilter,
};
const yearFiltering = {
  name: "year",
  value: "All",
  condition: yearFilter,
};
const sortByFiltering = {
  name: "sortBy",
  value: "popularity.desc",
  condition: () => true, // This doesn't filter, just for sorting
};

const MOVIES_PER_PAGE = 8;

const LoadMoreButton = styled(Button)({
  backgroundColor: "#E50914",
  color: "#FFFFFF",
  fontWeight: "bold",
  padding: "10px 24px",
  "&:hover": {
    backgroundColor: "#B2070F",
  },
  textTransform: "uppercase",
  letterSpacing: "1px",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgba(229, 9, 20, 0.3)",
});

const HomePage: React.FC = () => {
  const { data, error, isLoading, isError } = useQuery<DiscoverMovies, Error>("discover", getMovies);
  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering, ratingFiltering, yearFiltering, sortByFiltering]
  );
  
  // State to track how many movies to display
  const [moviesShown, setMoviesShown] = useState(MOVIES_PER_PAGE);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    
    // Find the index of the filter to update
    const filterIndex = filterValues.findIndex(filter => filter.name === type);
    
    if (filterIndex !== -1) {
      // Create a new array with the updated filter
      const updatedFilterSet = [...filterValues];
      updatedFilterSet[filterIndex] = changedFilter;
      setFilterValues(updatedFilterSet);
    }
    
    // Reset pagination when filters change
    setMoviesShown(MOVIES_PER_PAGE);
  };

  const movies = data ? data.results : [];
  const filteredMovies = filterFunction(movies);
  
  // Sort movies if sortBy filter is set
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    const sortBy = filterValues.find(f => f.name === "sortBy")?.value || "popularity.desc";
    const [field, direction] = sortBy.split(".");
    const multiplier = direction === "desc" ? -1 : 1;
    
    if (field === "popularity") {
      return (a.popularity - b.popularity) * multiplier;
    } else if (field === "vote_average") {
      return (a.vote_average - b.vote_average) * multiplier;
    } else if (field === "release_date") {
      return (new Date(a.release_date).getTime() - new Date(b.release_date).getTime()) * multiplier;
    }
    return 0;
  });
  
  // Get only the movies to display based on current pagination
  const displayedMovies = sortedMovies.slice(0, moviesShown);
  
  // Function to load more movies
  const loadMoreMovies = () => {
    setMoviesShown(prev => prev + MOVIES_PER_PAGE);
  };

  return (
    <>
      <PageTemplate
        title="Discover Movies"
        movies={displayedMovies}
        action={(movie: BaseMovieProps) => {
          return <AddToFavouritesIcon {...movie} />
        }}
      />
      
      {/* Pagination controls */}
{sortedMovies.length > moviesShown && (
  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
    <LoadMoreButton 
      variant="contained" 
      onClick={loadMoreMovies}
    >
      Load More Movies
    </LoadMoreButton>
  </Box>
)}
      
      {sortedMovies.length > 0 && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {displayedMovies.length} of {sortedMovies.length} movies
          </Typography>
        </Box>
      )}
      
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        ratingFilter={filterValues[2].value}
        yearFilter={filterValues[3].value}
        sortByFilter={filterValues[4].value}
      />
    </>
  );
};

export default HomePage;
