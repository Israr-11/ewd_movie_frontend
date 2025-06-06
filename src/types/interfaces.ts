export interface BaseMovieProps {
  adult: any;
  title: string;
  budget: number;
  homepage: string | undefined;
  id: number;
  imdb_id: string;
  original_language: string;
  overview: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  poster_path?: string;
  tagline: string;
  runtime: number;
  revenue: number;
  vote_count: number;
  favourite?: boolean;
  genre_ids?: number[];
  isError:any;
  movie:any;
}

export interface BaseMovieListProps {
  movies: BaseMovieProps[];
  action: (m: BaseMovieProps) => React.ReactNode;
}



export interface MovieDetailsProps extends BaseMovieProps {
  production_companies: any;
  images: any;
  genres: {
    id: number;
    name: string;
  }[];
}

export interface MovieImage {
  file_path: string;
  aspect_ratio?: number; 
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export interface MoviePageProps {
  movie: MovieDetailsProps;
  images: MovieImage[];
}

export type FilterOption = "title" | "genre" | "rating" | "year" | "sortBy";
export interface MovieListPageTemplateProps extends BaseMovieListProps {
  title: string;
}

export interface Review{
  id: string;
  content: string
  author: string
}

export interface GenreData {
  genres: {
    id: string;
    name: string
  }[];
}

export interface DiscoverMovies {
  page: number;	
  total_pages: number;
  total_results: number;
  results: BaseMovieProps[];
}

export interface Review {
  author: string,
  content: string,
  agree: boolean,
  rating: number,
  movieId: number,
}

export interface Playlist {
  Id: number;
  UserId: string;
  Title: string;
  Description: string;
  Movies: number[];
  CreatedDate: string;
  UpdatedDate: string;
}

export interface PlaylistMovie {
  movieId: number;
  title?: string;
  posterPath?: string;
}