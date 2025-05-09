import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  getPresignedUrl,
  uploadImageToS3,
  FantasyMovie,
  CastMember,
} from "../api/fantasy-movies-api";
import { isAuthenticated } from "../utils/auth";
import toast from "../utils/toastService";
import { useFantasyMovies } from "../hooks/useFantasyMovies";

const genreOptions = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

const CreateFantasyMoviePage = () => {
  const navigate = useNavigate();
  const { addMovie } = useFantasyMovies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [releaseDate, setReleaseDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [runtime, setRuntime] = useState<number>(120);
  const [companies, setCompanies] = useState<string[]>([]);
  const [newCompany, setNewCompany] = useState("");
  const [posterUrl] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const [cast, setCast] = useState<CastMember[]>([
    { Name: "", Role: "", Description: "" },
  ]);

  const [formErrors, setFormErrors] = useState({
    title: "",
    overview: "",
    genres: "",
    releaseDate: "",
    runtime: "",
    companies: "",
    poster: "",
    cast: "",
  });

  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
        setFormErrors((prev) => ({
          ...prev,
          poster: "Please upload a JPEG or PNG image",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          poster: "Image size should be less than 5MB",
        }));
        return;
      }

      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
      setFormErrors((prev) => ({ ...prev, poster: "" }));
    }
  };

  const uploadPoster = async () => {
    if (!posterFile) {
      setFormErrors((prev) => ({
        ...prev,
        poster: "Please select a poster image",
      }));
      return null;
    }

    try {
      setIsUploading(true);

      const { uploadUrl, publicUrl } = await getPresignedUrl(posterFile.type);

      await uploadImageToS3(uploadUrl, posterFile);

      return publicUrl;
    } catch (err) {
      console.error("Failed to upload poster:", err);
      setError(err instanceof Error ? err.message : "Failed to upload poster");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const addCastMember = () => {
    setCast([...cast, { Name: "", Role: "", Description: "" }]);
  };

  const removeCastMember = (index: number) => {
    if (cast.length > 1) {
      setCast(cast.filter((_, i) => i !== index));
    }
  };

  const updateCastMember = (
    index: number,
    field: keyof CastMember,
    value: string
  ) => {
    const updatedCast = [...cast];
    updatedCast[index] = { ...updatedCast[index], [field]: value };
    setCast(updatedCast);
  };

  const addCompany = () => {
    if (newCompany.trim() && !companies.includes(newCompany.trim())) {
      setCompanies([...companies, newCompany.trim()]);
      setNewCompany("");
    }
  };

  const removeCompany = (company: string) => {
    setCompanies(companies.filter((c) => c !== company));
  };

  const handleGenreChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setGenres(typeof value === "string" ? value.split(",") : value);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      title: "",
      overview: "",
      genres: "",
      releaseDate: "",
      runtime: "",
      companies: "",
      poster: "",
      cast: "",
    };

    if (!title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!overview.trim()) {
      errors.overview = "Overview is required";
      isValid = false;
    }

    if (genres.length === 0) {
      errors.genres = "At least one genre is required";
      isValid = false;
    }

    if (!releaseDate) {
      errors.releaseDate = "Release date is required";
      isValid = false;
    }

    if (!runtime || runtime <= 0) {
      errors.runtime = "Valid runtime is required";
      isValid = false;
    }

    if (companies.length === 0) {
      errors.companies = "At least one production company is required";
      isValid = false;
    }

    if (!posterFile && !posterUrl) {
      errors.poster = "Poster image is required";
      isValid = false;
    }

    const invalidCast = cast.some(
      (member) => !member.Name.trim() || !member.Role.trim()
    );
    if (invalidCast) {
      errors.cast = "All cast members must have a name and role";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let finalPosterUrl = posterUrl;
      if (posterFile) {
        finalPosterUrl = (await uploadPoster()) || "";
        if (!finalPosterUrl) {
          throw new Error("Failed to upload poster image");
        }
      }

      const movieData: FantasyMovie = {
        Title: title,
        Overview: overview,
        Genres: genres,
        ReleaseDate: releaseDate,
        Runtime: runtime,
        ProductionCompanies: companies,
        PosterUrl: finalPosterUrl,
        Cast: cast,
      };

      const newMovie = await addMovie(movieData);

      toast.success("Fantasy movie created successfully!");

      navigate(`/fantasy-movies/${newMovie.Id}`);
    } catch (err) {
      console.error("Failed to create fantasy movie:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create fantasy movie"
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to create fantasy movie"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Fantasy Movie
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left column - Basic info */}
            <Grid item xs={12} md={8}>
              <TextField
                label="Movie Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />

              <TextField
                label="Overview"
                fullWidth
                multiline
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                margin="normal"
                error={!!formErrors.overview}
                helperText={formErrors.overview}
                required
              />

              <FormControl
                fullWidth
                margin="normal"
                error={!!formErrors.genres}
              >
                <InputLabel id="genres-label">Genres</InputLabel>
                <Select
                  labelId="genres-label"
                  id="genres"
                  multiple
                  value={genres}
                  onChange={handleGenreChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {genreOptions.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.genres && (
                  <FormHelperText>{formErrors.genres}</FormHelperText>
                )}
              </FormControl>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Release Date"
                    type="date"
                    fullWidth
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    margin="normal"
                    error={!!formErrors.releaseDate}
                    helperText={formErrors.releaseDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Runtime (minutes)"
                    type="number"
                    fullWidth
                    value={runtime}
                    onChange={(e) => setRuntime(parseInt(e.target.value) || 0)}
                    margin="normal"
                    error={!!formErrors.runtime}
                    helperText={formErrors.runtime}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Production Companies
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TextField
                    label="Add Production Company"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1, mr: 1 }}
                    error={!!formErrors.companies && companies.length === 0}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={addCompany}
                    startIcon={<AddIcon />}
                    disabled={!newCompany.trim()}
                  >
                    Add
                  </Button>
                </Box>
                {formErrors.companies && companies.length === 0 && (
                  <FormHelperText error>{formErrors.companies}</FormHelperText>
                )}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {companies.map((company) => (
                    <Chip
                      key={company}
                      label={company}
                      onDelete={() => removeCompany(company)}
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Movie Poster
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: 300,
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: posterPreview
                        ? `url(${posterPreview})`
                        : "none",
                    }}
                  >
                    {!posterPreview && (
                      <Typography variant="body2" color="text.secondary">
                        No poster selected
                      </Typography>
                    )}
                  </Box>

                  <Button
                    component="label"
                    variant="contained"
                    color="error"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Poster"}
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png"
                      onChange={handlePosterChange}
                    />
                  </Button>
                  {formErrors.poster && (
                    <FormHelperText error>{formErrors.poster}</FormHelperText>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Cast Members</Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addCastMember}
                    >
                      Add
                    </Button>
                  </Box>

                  {formErrors.cast && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {formErrors.cast}
                    </Alert>
                  )}

                  {cast.map((member, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      {index > 0 && <Divider sx={{ my: 2 }} />}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle1">
                          Cast Member #{index + 1}
                        </Typography>

                        {cast.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeCastMember(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>

                      <TextField
                        label="Name"
                        fullWidth
                        size="small"
                        value={member.Name}
                        onChange={(e) =>
                          updateCastMember(index, "Name", e.target.value)
                        }
                        margin="dense"
                        required
                      />

                      <TextField
                        label="Role"
                        fullWidth
                        size="small"
                        value={member.Role}
                        onChange={(e) =>
                          updateCastMember(index, "Role", e.target.value)
                        }
                        margin="dense"
                        required
                      />

                      <TextField
                        label="Description"
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        value={member.Description}
                        onChange={(e) =>
                          updateCastMember(index, "Description", e.target.value)
                        }
                        margin="dense"
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/fantasy-movies")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={isSubmitting || isUploading}
              startIcon={
                isSubmitting && <CircularProgress size={20} color="inherit" />
              }
            >
              {isSubmitting ? "Creating..." : "Create Fantasy Movie"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateFantasyMoviePage;
