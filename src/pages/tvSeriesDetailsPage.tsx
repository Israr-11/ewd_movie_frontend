import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Rating,
  List,
  ListItem,
  ListItemText,
  Button,
  styled,
} from "@mui/material";
import useTVSeriesDetails from "../hooks/useTVSeriesDetails";
import img from "../images/film-poster-placeholder.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageContainer = styled(Box)({
  padding: "2rem 1.5rem",
  backgroundColor: "#0D0D0D",
  minHeight: "calc(100vh - 180px)",
  width: "96.9%",
  marginBottom: "5rem",
});

const BackButton = styled(Button)({
  color: "#E50914",
  marginBottom: "1.5rem",
  "&:hover": {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
  },
  "& .MuiSvgIcon-root": {
    color: "#E50914",
  },
});

const DetailCard = styled(Card)({
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  height: "100%",
  overflow: "hidden",
});

const PosterImage = styled(CardMedia)({
  height: 550,
  objectFit: "cover",
  borderBottom: "1px solid #333333",
});

const SeriesTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  marginBottom: "12px",
});

const InfoSection = styled(Box)({
  marginBottom: "16px",
});

const InfoText = styled(Typography)({
  color: "#CCCCCC",
});

const ChipContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "8px",
});

const ContentPaper = styled(Paper)({
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  padding: "24px",
  marginBottom: "24px",
});

const SectionTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  marginBottom: "16px",
  borderBottom: "2px solid #E50914",
  paddingBottom: "8px",
  display: "inline-block",
});

const CreatorChip = styled(Chip)({
  backgroundColor: "rgba(229, 9, 20, 0.1)",
  color: "#FFFFFF",
  border: "1px solid rgba(229, 9, 20, 0.3)",
  margin: "4px",
});

const SeasonItem = styled(ListItem)({
  borderRadius: "8px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

const SeasonImage = styled("img")({
  width: 100,
  borderRadius: "4px",
  border: "1px solid #333333",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const SeasonTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
});

const SeasonInfo = styled(Typography)({
  color: "#CCCCCC",
});

const SeasonOverview = styled(Typography)({
  color: "#AAAAAA",
  marginTop: "8px",
});

const RatingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
});

const TVSeriesDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { tvSeries, isLoading, error } = useTVSeriesDetails(id || "");
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

  if (!tvSeries) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">TV series not found</Alert>
      </Box>
    );
  }

  return (
    <PageContainer>
      <BackButton startIcon={<ArrowBackIcon />} onClick={() => navigate("/tv")}>
        Back to TV Series
      </BackButton>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <DetailCard>
            <PosterImage
              image={
                tvSeries.poster_path
                  ? `https://image.tmdb.org/t/p/w500${tvSeries.poster_path}`
                  : img
              }
              title={tvSeries.name}
            />
            <CardContent>
              <SeriesTitle variant="h5">{tvSeries.name}</SeriesTitle>

              <RatingContainer>
                <Rating
                  value={tvSeries.vote_average / 2}
                  precision={0.5}
                  readOnly
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#E50914",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {tvSeries.vote_average.toFixed(1)}/10
                </Typography>
              </RatingContainer>

              <InfoSection>
                <InfoText variant="body2" gutterBottom>
                  First aired:{" "}
                  {new Date(tvSeries.first_air_date).toLocaleDateString()}
                </InfoText>

                {tvSeries.last_air_date && (
                  <InfoText variant="body2" gutterBottom>
                    Last aired:{" "}
                    {new Date(tvSeries.last_air_date).toLocaleDateString()}
                  </InfoText>
                )}

                <InfoText variant="body2" gutterBottom>
                  Status:{" "}
                  <Chip
                    label={tvSeries.status}
                    size="small"
                    sx={{
                      ml: 1,
                      backgroundColor:
                        tvSeries.status === "Ended"
                          ? "rgba(150, 150, 150, 0.2)"
                          : "rgba(0, 200, 83, 0.2)",
                      color:
                        tvSeries.status === "Ended" ? "#CCCCCC" : "#00C853",
                      border:
                        tvSeries.status === "Ended"
                          ? "1px solid #555555"
                          : "1px solid rgba(0, 200, 83, 0.3)",
                    }}
                  />
                </InfoText>

                <InfoText variant="body2" gutterBottom>
                  Seasons: {tvSeries.number_of_seasons} | Episodes:{" "}
                  {tvSeries.number_of_episodes}
                </InfoText>
              </InfoSection>

              {tvSeries.genres && tvSeries.genres.length > 0 && (
                <InfoSection>
                  <InfoText variant="body2">Genres:</InfoText>
                  <ChipContainer>
                    {tvSeries.genres.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(229, 9, 20, 0.1)",
                          color: "#FFFFFF",
                          border: "1px solid rgba(229, 9, 20, 0.3)",
                        }}
                      />
                    ))}
                  </ChipContainer>
                </InfoSection>
              )}

              {tvSeries.networks && tvSeries.networks.length > 0 && (
                <InfoSection>
                  <InfoText variant="body2">Networks:</InfoText>
                  <ChipContainer>
                    {tvSeries.networks.map((network) => (
                      <Chip
                        key={network.id}
                        label={network.name}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: "#CCCCCC",
                          borderColor: "#555555",
                        }}
                      />
                    ))}
                  </ChipContainer>
                </InfoSection>
              )}

              <InfoText variant="body2" gutterBottom>
                Origin Country:{" "}
                {tvSeries.origin_country?.join(", ") || "Unknown"}
              </InfoText>

              <InfoText variant="body2" gutterBottom>
                Type: {tvSeries.type || "TV Series"}
              </InfoText>
            </CardContent>
          </DetailCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <ContentPaper>
            <SectionTitle variant="h5">Overview</SectionTitle>
            <Typography variant="body1" sx={{ color: "#CCCCCC" }}>
              {tvSeries.overview || "No overview available."}
            </Typography>
          </ContentPaper>

          {tvSeries.created_by && tvSeries.created_by.length > 0 && (
            <ContentPaper>
              <SectionTitle variant="h5">Created By</SectionTitle>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {tvSeries.created_by.map((creator) => (
                  <CreatorChip key={creator.id} label={creator.name} />
                ))}
              </Box>
            </ContentPaper>
          )}

          {tvSeries.seasons && tvSeries.seasons.length > 0 && (
            <ContentPaper>
              <SectionTitle variant="h5">Seasons</SectionTitle>
              <List sx={{ p: 0 }}>
                {tvSeries.seasons.map((season) => (
                  <React.Fragment key={season.id}>
                    <SeasonItem alignItems="flex-start">
                      <Box sx={{ display: "flex", width: "100%" }}>
                        <Box sx={{ mr: 2 }}></Box>
                        <ListItemText
                          primary={
                            <SeasonTitle variant="subtitle1">
                              {season.name}
                            </SeasonTitle>
                          }
                          secondary={
                            <Box>
                              <SeasonInfo variant="body2">
                                {season.air_date &&
                                  `Air date: ${new Date(
                                    season.air_date
                                  ).toLocaleDateString()} • `}
                                {season.episode_count} episodes
                              </SeasonInfo>
                              {season.overview && (
                                <SeasonOverview variant="body2">
                                  {season.overview}
                                </SeasonOverview>
                              )}
                            </Box>
                          }
                        />
                      </Box>
                    </SeasonItem>
                    <Divider
                      variant="inset"
                      component="li"
                      sx={{ backgroundColor: "#333333" }}
                    />
                  </React.Fragment>
                ))}
              </List>
            </ContentPaper>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TVSeriesDetailsPage;
