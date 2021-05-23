import React, {useEffect, useState} from 'react';
import {Card, CardProps, Layout, Spinner, Text} from '@ui-kitten/components';
import {useNavigation, useRoute} from '@react-navigation/core';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {Image, ListRenderItem, StyleSheet, View, FlatList} from 'react-native';
import {TMDBApi, MovieItem, MovieListKind} from './services/tmdb';
export interface MovieListRouteParams extends RouteProp<ParamListBase, string> {
  name: MovieListKind;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: 180,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  cardWrapper: {
    flexDirection: 'row',
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 10,
  },
  cardImage: {
    width: 102,
    height: 148,
    borderRadius: 10,
    marginRight: 5,
  },
  cardGenres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genrePill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    margin: 2,
  },
  genrePillText: {
    fontSize: 14,
  },
  rating: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ratingText: {
    color: 'green',
  },
  loadingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    padding: 20,
  },
});

export const MovieCard: React.FunctionComponent<MovieItem & CardProps> = ({
  title,
  releaseDate,
  voteAverage,
  posterUrl,
  genres,
  ...props
}) => {
  return (
    <Card style={styles.card} {...props}>
      <View style={styles.cardWrapper}>
        <Image
          style={styles.cardImage}
          source={{
            uri: posterUrl(2).href,
          }}
        />
        <View style={styles.cardBody}>
          <Text category="h5">{title}</Text>
          <Text category="s1" appearance="hint">
            {releaseDate.format('LL')}
          </Text>
          <View style={styles.cardGenres}>
            {genres.map(item => (
              <View key={item} style={styles.genrePill}>
                <Text style={styles.genrePillText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingText} category="h4">
              {voteAverage.toString()}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export const MovieList: React.FunctionComponent = () => {
  const route = useRoute<MovieListRouteParams>();
  const navigation = useNavigation();

  const [movies, setMovies] = useState<Array<MovieItem>>([]);
  const [nextPage, setNextPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMoreMovies = async () => {
    setIsLoading(true);

    const _movies = await TMDBApi.getMovies(route.name, nextPage);
    setMovies([...movies, ..._movies]);
    setNextPage(nextPage + 1);

    setIsLoading(false);
  };

  const renderItem: ListRenderItem<MovieItem> = ({item}) => (
    <MovieCard
      onPress={() => navigation.navigate('Details', {id: item.id})}
      {...item}
    />
  );

  useEffect(() => {
    loadMoreMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout level="2" style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderItem}
        onEndReached={() => loadMoreMovies()}
      />
      {isLoading && (
        <View style={styles.loadingWrapper}>
          <Spinner size="giant" />
        </View>
      )}
    </Layout>
  );
};
