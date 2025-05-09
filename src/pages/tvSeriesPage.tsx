import { Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress, Alert, Rating, styled, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import useTVSeries from "../hooks/useTVSeries";
import img from '../images/film-poster-placeholder.png';

const PageContainer = styled(Box)({
  padding: "2rem 1.5rem",
  backgroundColor: "#0D0D0D",
  minHeight: "calc(100vh - 180px)",
  width: "96.9%",
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

const SeriesCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 20px rgba(229, 9, 20, 0.3)",
    "& .MuiCardMedia-root": {
      transform: "scale(1.05)",
    }
  },
});

const SeriesImage = styled(CardMedia)({
  height: 400,
  objectFit: "cover",
  borderBottom: "1px solid #333333",
  transition: "transform 0.5s ease",
});

const SeriesContent = styled(CardContent)({
  flexGrow: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const SeriesTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  marginBottom: "8px",
  lineHeight: 1.2,
});

const SeriesOverview = styled(Typography)({
  color: "#AAAAAA",
  marginTop: "0.5rem",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const RatingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
});

const RatingText = styled(Typography)({
  marginLeft: "8px",
  color: "#CCCCCC",
});

const TVSeriesPage = () => {
  const { tvSeries, isLoading, error } = useTVSeries();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
      <PageTitle variant="h4">
        Popular TV Series
      </PageTitle>
      
      <Grid container spacing={3}>
        {tvSeries.map((series) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={series.id}>
            <Link to={`/tv/${series.id}`} style={{ textDecoration: 'none' }}>
              <SeriesCard>
                <SeriesImage
                  image={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : img}
                  title={series.name}
                />
                <SeriesContent>
                  <Box>
                    <SeriesTitle variant="h6">
                      {series.name}
                    </SeriesTitle>
                    
                    <RatingContainer>
                      <Rating 
                        value={series.vote_average / 2} 
                        precision={0.5} 
                        readOnly 
                        size="small"
                        sx={{ 
                          "& .MuiRating-iconFilled": {
                            color: "#E50914"
                          }
                        }}
                      />
                      <RatingText variant="body2">
                        {series.vote_average.toFixed(1)}/10
                      </RatingText>
                    </RatingContainer>
                    
                    <Chip 
                      label={new Date(series.first_air_date).getFullYear()} 
                      size="small" 
                      sx={{ 
                        backgroundColor: "rgba(229, 9, 20, 0.1)",
                        color: "#FFFFFF",
                        border: "1px solid rgba(229, 9, 20, 0.3)",
                        mb: 1
                      }} 
                    />
                    
                    <SeriesOverview variant="body2">
                      {series.overview}
                    </SeriesOverview>
                  </Box>
                </SeriesContent>
              </SeriesCard>
            </Link>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default TVSeriesPage;
