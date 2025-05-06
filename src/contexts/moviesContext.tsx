import React, { useState, useCallback } from "react";
import { BaseMovieProps, Review } from "../types/interfaces";

interface MovieContextInterface {
    favourites: number[];
    addToFavourites: ((movie: BaseMovieProps) => void);
    removeFromFavourites: ((movie: BaseMovieProps) => void);
    addReview: ((movie: BaseMovieProps, review: Review) => void);
    watchlist: number[]; // New watchlist state
    addToWatchlist: ((movie: BaseMovieProps) => void); // New function
    removeFromWatchlist: ((movie: BaseMovieProps) => void); // New function
}

const initialContextState: MovieContextInterface = {
    favourites: [],
    addToFavourites: () => {},
    removeFromFavourites: () => {},
    addReview: (movie, review) => { movie.id, review},
    watchlist: [], // Initialize empty watchlist
    addToWatchlist: () => {}, // Initialize empty function
    removeFromWatchlist: () => {}, // Initialize empty function
};

export const MoviesContext = React.createContext<MovieContextInterface>(initialContextState);

const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [favourites, setFavourites] = useState<number[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>( [] );
    const [watchlist, setWatchlist] = useState<number[]>([]); // New state for watchlist

    const addToFavourites = useCallback((movie: BaseMovieProps) => {
        setFavourites((prevFavourites) => {
            if (!prevFavourites.includes(movie.id)) {
                return [...prevFavourites, movie.id];
            }
            return prevFavourites;
        });
    }, []);

    const removeFromFavourites = useCallback((movie: BaseMovieProps) => {
        setFavourites((prevFavourites) => prevFavourites.filter((mId) => mId !== movie.id));
    }, []);

    const addReview = (movie:BaseMovieProps, review: Review) => {
        setMyReviews( {...myReviews, [movie.id]: review } )
    };

    // New function to add a movie to the watchlist
    const addToWatchlist = useCallback((movie: BaseMovieProps) => {
        setWatchlist((prevWatchlist) => {
            if (!prevWatchlist.includes(movie.id)) {
                return [...prevWatchlist, movie.id];
            }
            return prevWatchlist;
        });
    }, []);

    // New function to remove a movie from the watchlist
    const removeFromWatchlist = useCallback((movie: BaseMovieProps) => {
        setWatchlist((prevWatchlist) => prevWatchlist.filter((mId) => mId !== movie.id));
    }, []);

    return (
        <MoviesContext.Provider
            value={{
                favourites,
                addToFavourites,
                removeFromFavourites,
                addReview,
                watchlist, // Add watchlist to context
                addToWatchlist, // Add function to context
                removeFromWatchlist, // Add function to context
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;
