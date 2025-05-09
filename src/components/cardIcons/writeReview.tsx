import React from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { BaseMovieProps } from "../../types/interfaces";
import { Link } from "react-router-dom";

const WriteReviewIcon: React.FC<BaseMovieProps> = (movie) => {
  return (
    <Link to={`/reviews/form?movieId=${movie.id}`}>
      <RateReviewIcon
        sx={{ color: "#E50914", padding: "8px", height: "25px", width: "25px" }}
      />
    </Link>
  );
};
export default WriteReviewIcon;
