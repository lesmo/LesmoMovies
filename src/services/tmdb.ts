//@ts-ignore This import won't resolve, but it's digested by Babel for env-var support
import {TMDB_API_KEY} from '@env';
import axios from 'axios';
import {setupCache} from 'axios-cache-adapter';
import moment from 'moment';
import _ from 'lodash';

/**
 * Setup an "agressive" cache to avoid unnecessary requests
 * during exploration, plus improves response times.
 */
const cache = setupCache({
  maxAge: 60 * 60 * 1000, // 1hr cache
});

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  adapter: cache.adapter,
});

/**
 * Add an interceptor to append the API Key to all requests
 * automatically (so we don't bother everywhere else).
 */
api.interceptors.request.use(config => {
  !config.params && (config.params = {});
  config.params.api_key = TMDB_API_KEY;
  return config;
});

/**
 * Image Configuration Data as returned by TMBDB
 *
 * @see https://developers.themoviedb.org/3/configuration/get-api-configuration
 */
export interface ApiImageConfigurationData {
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export enum MovieListKind {
  Upcoming = 'upcoming',
  Popular = 'popular',
  TopRated = 'top_rated',
}

/**
 * Movie credit data.
 *
 * @see https://developers.themoviedb.org/3/movies/get-movie-credits
 */
export interface MovieCredit {
  id: number;
  name: string;
  profileUrl: (size?: number) => URL;
}

/**
 * Movie item data.
 *
 * @see https://developers.themoviedb.org/3/movies/get-popular-movies
 * @see https://developers.themoviedb.org/3/movies/get-top-rated-movies
 * @see https://developers.themoviedb.org/3/movies/get-upcoming
 */
export interface MovieItem {
  id: number;
  posterUrl: (size?: number) => URL;
  releaseDate: moment.Moment;
  genres: Array<string>;
  title: string;
  backdropUrl: (size?: number) => URL;
  popularity: number;
  voteAverage: number;
}

/**
 * Movie detail data.
 *
 * @see https://developers.themoviedb.org/3/movies/get-movie-details
 */
export interface MovieDetailItem extends MovieItem {
  overview: string;
  credits: {
    cast: MovieCredit[];
    crew: MovieCredit[];
  };
}

/**
 * A key-value dictionary of Genre IDs and their name.
 */
export interface GenreDictionary {
  [id: number]: string;
}

/**
 * Simple class that allows producing valid image URLs from the Image
 * Configuration Data provided by TMDB.
 */
class ApiConfiguration {
  protected readonly imgConfig: ApiImageConfigurationData;

  constructor(configurationData: ApiImageConfigurationData) {
    this.imgConfig = configurationData;
  }

  /**
   * Get an Image size string to construct a URL.
   *
   * @param key Key from the Image Configuration data
   * @param size Size INDEX (not name), defaults to the biggest available. Negative values allowed to pick from the biggest downward.
   * @returns Size string
   *
   * @see https://developers.themoviedb.org/3/configuration/get-api-configuration
   */
  public getSize(
    key: keyof ApiImageConfigurationData,
    size: number = -1,
  ): string | undefined {
    // Do some fun stuff to do python-like indexing
    if (size < 0) {
      size = this.imgConfig[key].length + size;
    }
    size = _.clamp(size, 0, this.imgConfig[key].length - 1);
    return this.imgConfig[key][size];
  }

  /**
   * Generate a valid URL to an image.
   *
   * @param key Image sizing key
   * @param path Image path as provided by TMDB API
   * @param size Image Size index, defaults to the biggest available.
   * @returns Valid URL object
   *
   * @see https://developers.themoviedb.org/3/configuration/get-api-configuration
   */
  public getUrl(
    key: keyof ApiImageConfigurationData,
    path: string,
    size: number = -1,
  ) {
    return new URL(
      `${this.getSize(key, size)}${path}`,
      this.imgConfig.secure_base_url,
    );
  }

  /**
   * Generate a valid URL factory.
   *
   * @param key Image sizing key
   * @param path Image path as provided by TMDB API
   * @returns A small function to easily generate any particularly sized Image URL
   *
   * @see https://developers.themoviedb.org/3/configuration/get-api-configuration
   */
  public getUrlFactory(key: keyof ApiImageConfigurationData, path: string) {
    return (size: number = -1) => this.getUrl(key, path, size);
  }
}

export class TMDBApi {
  protected static apiConfig: ApiConfiguration;

  /**
   * Retrieve TMBD Configuration data.
   *
   * @returns Configuration instance
   */
  public static async getConfig() {
    if (this.apiConfig) {
      return this.apiConfig;
    }

    const response = await api.get('/configuration', {
      cache: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    });
    const {images} = response.data;

    return (this.apiConfig = new ApiConfiguration(images));
  }

  /**
   * Retrieve Genres.
   *
   * @returns Dictionary of ID-Name of Genres
   *
   * @see https://developers.themoviedb.org/3/genres/get-movie-list
   */
  public static async getGenres(): Promise<GenreDictionary> {
    const response = await api.get('/genre/movie/list');
    const {genres} = response.data;

    return _(genres).keyBy('id').mapValues('name').value();
  }

  /**
   * Retrieve Movies list.
   *
   * @param listKind Kind of movie list to retrieve
   * @param page Page number to retrieve
   * @returns Movies
   *
   * @see https://developers.themoviedb.org/3/movies/get-popular-movies
   * @see https://developers.themoviedb.org/3/movies/get-top-rated-movies
   * @see https://developers.themoviedb.org/3/movies/get-upcoming
   */
  public static async getMovies(
    listKind: MovieListKind,
    page: number,
  ): Promise<MovieItem[]> {
    const [config, genres, response] = await Promise.all([
      this.getConfig(),
      this.getGenres(),
      api.get(`/movie/${listKind}`, {params: {page}}),
    ]);

    const results: MovieItem[] = _(response.data.results)
      .map(item => ({
        id: item.id,
        posterUrl: config.getUrlFactory('poster_sizes', item.poster_path),
        backdropUrl: config.getUrlFactory('backdrop_sizes', item.backdrop_path),
        releaseDate: moment(item.release_date),
        genres: item.genre_ids.map((genre_id: number) => genres[genre_id]),
        title: item.title,
        popularity: item.popularity,
        voteAverage: item.vote_average,
      }))
      .value();

    return results;
  }

  /**
   * Retrieve a specific Movie details
   *
   * @param movieId Move ID from getMovies()
   * @returns Movie detail
   *
   * @see https://developers.themoviedb.org/3/movies/get-movie-details
   */
  public static async getMovieDetail(
    movieId: number,
  ): Promise<MovieDetailItem> {
    const [config, response] = await Promise.all([
      this.getConfig(),
      api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'credits',
        },
      }),
    ]);
    const item = response.data;
    const result: MovieDetailItem = {
      id: item.id,
      posterUrl: config.getUrlFactory('poster_sizes', item.poster_path),
      backdropUrl: config.getUrlFactory('backdrop_sizes', item.backdrop_path),
      releaseDate: moment(item.release_date),
      genres: item.genres.map(({name}: {name: string}) => name),
      title: item.title,
      popularity: item.popularity,
      voteAverage: item.vote_average,
      overview: item.overview,
      credits: {
        cast: item.credits.cast.map((credit: any) => ({
          id: credit.id,
          name: credit.name,
          profileUrl: config.getUrlFactory(
            'profile_sizes',
            credit.profile_path,
          ),
        })),
        crew: item.credits.cast.map((credit: any) => ({
          id: credit.id,
          name: credit.name,
          profileUrl: config.getUrlFactory(
            'profile_sizes',
            credit.profile_path,
          ),
        })),
      },
    };

    return result;
  }
}
