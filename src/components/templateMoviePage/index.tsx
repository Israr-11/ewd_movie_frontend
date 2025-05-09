import React from "react";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  Divider,
  styled,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { MovieDetailsProps } from "../../types/interfaces";
import img from "../../images/film-poster-placeholder.png";
import AddToFavouritesIcon from "../cardIcons/addToFavourites";

const PageContainer = styled(Box)({
  width: "100%",
  marginBottom: "5rem",
});

const DetailCard = styled(Card)({
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  overflow: "hidden",
  height: "100%",
});

const PosterImage = styled(CardMedia)({
  height: 500,
  objectFit: "cover",
  borderBottom: "1px solid #333333",
});

const MovieTitle = styled(Typography)({
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
  marginBottom: "16px",
});

const ContentSection = styled(Box)({
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

const RatingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
});

const StyledImageList = styled(ImageList)({
  height: 450,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#1e1e1e",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#555",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#E50914",
  },
});

const ImageItem = styled(ImageListItem)({
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: "4px",
  border: "1px solid #333333",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  },
  "& img": {
    transition: "transform 0.5s ease",
  },
  "&:hover img": {
    transform: "scale(1.1)",
  },
});

const ActionContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "16px",
});

interface TemplateMoviePageProps {
  movie: MovieDetailsProps;
  children: React.ReactNode;
}

const TemplateMoviePage: React.FC<TemplateMoviePageProps> = ({
  movie,
  children,
}) => {
  const limitedImages = movie.images?.backdrops?.slice(0, 8) || [];

  return (
    <PageContainer>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <DetailCard>
            <PosterImage
              image={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : img
              }
              title={movie.title}
            />
            <CardContent>
              <MovieTitle variant="h5">
                {movie.title}
                {movie.release_date && (
                  <Typography component="span" sx={{ color: "#AAAAAA", ml: 1 }}>
                    ({new Date(movie.release_date).getFullYear()})
                  </Typography>
                )}
              </MovieTitle>

              <RatingContainer>
                <Rating
                  value={movie.vote_average / 2}
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
                  {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
                </Typography>
              </RatingContainer>

              <ActionContainer>
                <AddToFavouritesIcon {...movie} />
              </ActionContainer>

              <Divider sx={{ my: 2, backgroundColor: "#333333" }} />

              <InfoSection>
                {movie.release_date && (
                  <InfoText variant="body2" gutterBottom>
                    Release Date:{" "}
                    {new Date(movie.release_date).toLocaleDateString()}
                  </InfoText>
                )}

                {movie.runtime && (
                  <InfoText variant="body2" gutterBottom>
                    Runtime: {movie.runtime} minutes
                  </InfoText>
                )}

                {movie.revenue > 0 && (
                  <InfoText variant="body2" gutterBottom>
                    Revenue: ${(movie.revenue / 1000000).toFixed(2)} million
                  </InfoText>
                )}
              </InfoSection>

              {movie.genres && movie.genres.length > 0 && (
                <InfoSection>
                  <InfoText variant="body2">Genres:</InfoText>
                  <ChipContainer>
                    {movie.genres.map((genre) => (
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

              {movie.production_companies &&
                movie.production_companies.length > 0 && (
                  <InfoText variant="body2" gutterBottom>
                    Production:{" "}
                    {movie.production_companies
                      .map((c: { name: any }) => c.name)
                      .slice(0, 2)
                      .join(", ")}
                    {movie.production_companies.length > 2 && " and others"}
                  </InfoText>
                )}
            </CardContent>
          </DetailCard>

          {limitedImages.length > 0 && (
            <ContentSection sx={{ mt: 3 }}>
              <SectionTitle variant="h6">Images</SectionTitle>
              <StyledImageList cols={2} gap={8}>
                {limitedImages.map(
                  (image: { file_path: any }, index: number) => (
                    <ImageItem key={index}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                        alt={`Movie scene ${index + 1}`}
                        loading="lazy"
                      />
                    </ImageItem>
                  )
                )}
              </StyledImageList>
            </ContentSection>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          <ContentSection>
            <SectionTitle variant="h5">Overview</SectionTitle>
            <Typography variant="body1" sx={{ color: "#CCCCCC" }}>
              {movie.overview || "No overview available."}
            </Typography>
          </ContentSection>

          <ContentSection>{children}</ContentSection>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TemplateMoviePage;
