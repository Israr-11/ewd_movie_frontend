import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Chip,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";
import useActors from "../hooks/useActors";
import img from "../images/film-poster-placeholder.png";

const PageContainer = styled(Box)({
  padding: "2rem 1.5rem",
  backgroundColor: "#0D0D0D",
  minHeight: "calc(100vh - 180px)",
  marginBottom: "5rem",
});

const PageTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  borderBottom: "2px solid #E50914",
  paddingBottom: "0.5rem",
  display: "inline-block",
});

const ActorCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
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

const ActorName = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
});

const KnownFor = styled(Typography)({
  color: "#AAAAAA",
  marginTop: "0.5rem",
});

const ActorImage = styled(CardMedia)({
  height: 350,
  objectFit: "cover",
  borderBottom: "1px solid #333333",
});

const ActorsPage = () => {
  const { actors, isLoading, error } = useActors();

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

  return (
    <PageContainer>
      <PageTitle variant="h4">Popular Actors</PageTitle>

      <Grid container spacing={3}>
        {actors.map((actor) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={actor.id}>
            <Link to={`/actors/${actor.id}`} style={{ textDecoration: "none" }}>
              <ActorCard>
                <ActorImage
                  image={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : img
                  }
                  title={actor.name}
                />
                <CardContent>
                  <ActorName variant="h6" gutterBottom>
                    {actor.name}
                  </ActorName>
                  <Chip
                    label={actor.known_for_department}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(229, 9, 20, 0.1)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(229, 9, 20, 0.3)",
                      mb: 1,
                    }}
                  />
                  {actor.known_for && actor.known_for.length > 0 && (
                    <KnownFor variant="body2">
                      Known for:{" "}
                      {actor.known_for
                        .map((item) => item.title || item.name)
                        .slice(0, 2)
                        .join(", ")}
                    </KnownFor>
                  )}
                </CardContent>
              </ActorCard>
            </Link>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default ActorsPage;
