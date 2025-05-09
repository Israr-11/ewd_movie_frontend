import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { getMovieReviews } from "../../api/tmdb-api";
import { excerpt } from "../../../utils";
import { MovieDetailsProps, Review } from "../../types/interfaces";
import { Box, IconButton, Typography, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const styles = {
    table: {
        minWidth: 550,
    },
};

const HeaderContainer = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 16px 0 16px",
});

const ReviewTitle = styled(Typography)({
    color: "#FFFFFF",
    fontWeight: "bold",
});

const CloseButton = styled(IconButton)({
    color: "#E50914",
    "&:hover": {
        backgroundColor: "rgba(229, 9, 20, 0.1)",
    },
});

interface MovieReviewsProps extends MovieDetailsProps {
    onClose?: () => void;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ id, onClose }) => { 
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        getMovieReviews(id).then((reviews) => {
            setReviews(reviews);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Paper sx={{ backgroundColor: "#0D0D0D", color: "#FFFFFF" }}>
            <HeaderContainer>
                <ReviewTitle variant="h6">Reviews</ReviewTitle>
                {onClose && (
                    <CloseButton aria-label="close" onClick={onClose}>
                        <CloseIcon />
                    </CloseButton>
                )}
            </HeaderContainer>
            
            <TableContainer component={Paper} sx={{ backgroundColor: "#0D0D0D", color: "#FFFFFF" }}>
                <Table sx={styles.table} aria-label="reviews table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Author</TableCell>
                            <TableCell align="center" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>Excerpt</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.length > 0 ? (
                            reviews.map((r: Review) => (
                                <TableRow key={r.id} sx={{ 
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                                    "& .MuiTableCell-root": { color: "#CCCCCC", borderBottom: "1px solid #333333" }
                                }}>
                                    <TableCell component="th" scope="row">
                                        {r.author}
                                    </TableCell>
                                    <TableCell>{excerpt(r.content)}</TableCell>
           
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ color: "#CCCCCC" }}>
                                    No reviews available for this movie.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default MovieReviews;
