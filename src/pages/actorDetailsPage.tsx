import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  styled,
  Button,
} from "@mui/material";
import useActorDetails from "../hooks/useActorDetails";
import img from "../images/film-poster-placeholder.png";
import movieImg from "../images/film-poster-placeholder.png";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const PageContainer = styled(Box)({
  padding: "2rem 1.5rem",
  backgroundColor: "#0D0D0D",
  minHeight: "calc(100vh - 180px)",
  marginBottom: "5rem",
});

const ProfileCard = styled(Card)({
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  height: "100%",
});

const ProfileImage = styled(CardMedia)({
  height: 500,
  objectFit: "cover",
  borderBottom: "1px solid #333333",
});

const ActorName = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
});

const InfoText = styled(Typography)({
  color: "#CCCCCC",
});

const BiographyPaper = styled(Paper)({
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  padding: "1.5rem",
  marginBottom: "2rem",
});

const SectionTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  marginBottom: "1rem",
  borderBottom: "2px solid #E50914",
  paddingBottom: "0.5rem",
  display: "inline-block",
});

const MovieCard = styled(Card)({
  height: "100%",
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
  },
});

const MovieImage = styled(CardMedia)({
  height: 200,
  objectFit: "cover",
  borderBottom: "1px solid #333333",
});

const MovieTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const CharacterName = styled(Typography)({
  color: "#AAAAAA",
});

const BackButton = styled(Button)({
  color: "#E50914",
  marginBottom: "1rem",
  "&:hover": {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
  },
  "& .MuiSvgIcon-root": {
    color: "#E50914",
  },
});

const ActorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { actor, credits, isLoading, error } = useActorDetails(id || "");
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: "#E50914" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  if (!actor) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">Actor not found</Alert>
      </Box>
    );
  }

  const sortedCastCredits = credits?.cast
    ? [...credits.cast].sort((a, b) => b.popularity - a.popularity).slice(0, 12)
    : [];

  return (
    <PageContainer>
      <BackButton
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/actors")}
      >
        Back to Actors
      </BackButton>

      <Grid container spacing={4}>
        {/* Left column - Profile */}
        <Grid item xs={12} md={4}>
          <ProfileCard>
            <ProfileImage
              image={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : img
              }
              title={actor.name}
            />
            <CardContent>
              <ActorName variant="h5" gutterBottom>
                {actor.name}
              </ActorName>

              {actor.birthday && (
                <InfoText variant="body2" gutterBottom>
                  Born: {new Date(actor.birthday).toLocaleDateString()}
                  {actor.place_of_birth && ` in ${actor.place_of_birth}`}
                </InfoText>
              )}

              {actor.deathday && (
                <InfoText variant="body2" gutterBottom>
                  Died: {new Date(actor.deathday).toLocaleDateString()}
                </InfoText>
              )}

              {actor.also_known_as && actor.also_known_as.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <InfoText variant="body2">Also known as:</InfoText>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {actor.also_known_as.map((name: string, index: number) => (
                      <Chip
                        key={index}
                        label={name}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: "#CCCCCC",
                          borderColor: "#333333",
                          margin: "0.25rem 0.25rem 0.25rem 0",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </ProfileCard>
        </Grid>

        {/* Right column - Biography and filmography */}
        <Grid item xs={12} md={8}>
          <BiographyPaper>
            <SectionTitle variant="h5">Biography</SectionTitle>
            <Typography variant="body1" paragraph sx={{ color: "#CCCCCC" }}>
              {actor.biography || "No biography available."}
            </Typography>
          </BiographyPaper>

          {credits && credits.cast && credits.cast.length > 0 && (
            <BiographyPaper>
              <SectionTitle variant="h5">Known For</SectionTitle>
              <Grid container spacing={2}>
                {sortedCastCredits.map((movie) => (
                  <Grid item xs={6} sm={4} md={3} key={movie.id}>
                    <Link
                      to={`/movies/${movie.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <MovieCard>
                        <MovieImage
                          image={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : movieImg
                          }
                          title={movie.title}
                        />
                        <CardContent sx={{ py: 1 }}>
                          <MovieTitle variant="body2" noWrap>
                            {movie.title}
                          </MovieTitle>
                          <CharacterName variant="caption">
                            {movie.character && `as ${movie.character}`}
                          </CharacterName>
                        </CardContent>
                      </MovieCard>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </BiographyPaper>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ActorDetailsPage;
