import React, { ChangeEvent } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getGenres } from "../../api/tmdb-api";
import { FilterOption, GenreData } from "../../types/interfaces";
import { useQuery } from "react-query";
import Spinner from "../spinner";
import { 
  FormControlLabel, 
  FormGroup, 
  Slider, 
  Box, 
  Radio,
  RadioGroup
} from "@mui/material";

const styles = {
  root: {
    maxWidth: 345,
  },
  media: { height: 300 },
  formControl: {
    margin: 1,
    minWidth: 220,
    backgroundColor: "rgb(255, 255, 255)",
  },
  slider: {
    width: "90%",
    margin: "0 auto",
  }
};

interface FilterMoviesCardProps {
  onUserInput: (f: FilterOption, s: string) => void;
  titleFilter: string;
  genreFilter: string;
  ratingFilter: string;
  yearFilter: string;
  sortByFilter: string;
}

const FilterMoviesCard: React.FC<FilterMoviesCardProps> = ({
  titleFilter,
  genreFilter,
  ratingFilter,
  yearFilter,
  sortByFilter,
  onUserInput,
}) => {
  
  const { data, error, isLoading, isError } = useQuery<GenreData, Error>("genres", getGenres);

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }
  const genres = data?.genres || [];
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  const handleChange = (e: SelectChangeEvent | ChangeEvent<HTMLInputElement>, type: FilterOption, value: string) => {
    e.preventDefault();
    onUserInput(type, value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e, "title", e.target.value);
  };

  const handleGenreChange = (e: SelectChangeEvent) => {
    handleChange(e, "genre", e.target.value);
  };

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    onUserInput("rating", newValue.toString());
  };

  const handleYearChange = (e: SelectChangeEvent) => {
    handleChange(e, "year", e.target.value);
  };

  const handleSortByChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e, "sortBy", e.target.value);
  };

  // Generate year options from 1990 to current year
  const currentYear = new Date().getFullYear();
  const years = ["All", ...Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear - i).toString())];

  return (
    <>
      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <FilterAltIcon fontSize="large" />
            Filter the movies
          </Typography>

          <TextField
            sx={styles.formControl}
            id="filled-search"
            label="Search by title"
            type="search"
            value={titleFilter}
            variant="filled"
            onChange={handleTextChange}
          />

          <FormControl sx={styles.formControl}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              value={genreFilter}
              onChange={handleGenreChange}
            >
              {genres.map((genre) => {
                return (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <InputLabel id="year-label">Release Year</InputLabel>
            <Select
              labelId="year-label"
              id="year-select"
              value={yearFilter || "All"}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography id="rating-slider" gutterBottom>
              Minimum Rating: {ratingFilter || "0"}
            </Typography>
            <Slider
              sx={styles.slider}
              value={Number(ratingFilter) || 0}
              onChange={handleRatingChange}
              aria-labelledby="rating-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0}
              max={10}
            />
          </Box>
        </CardContent>
      </Card>
      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <SortIcon fontSize="large" />
            Sort the movies
          </Typography>
          
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              aria-label="sort-by"
              name="sort-by"
              value={sortByFilter || "popularity.desc"}
              onChange={handleSortByChange}
            >
              <FormControlLabel value="popularity.desc" control={<Radio />} label="Popularity (Descending)" />
              <FormControlLabel value="popularity.asc" control={<Radio />} label="Popularity (Ascending)" />
              <FormControlLabel value="vote_average.desc" control={<Radio />} label="Rating (Descending)" />
              <FormControlLabel value="vote_average.asc" control={<Radio />} label="Rating (Ascending)" />
              <FormControlLabel value="release_date.desc" control={<Radio />} label="Release Date (Newest)" />
              <FormControlLabel value="release_date.asc" control={<Radio />} label="Release Date (Oldest)" />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </>
  );
};

export default FilterMoviesCard;
