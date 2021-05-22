import React from 'react';
import {Button, Card, CardProps, Layout, Text} from '@ui-kitten/components';
import {useNavigation, useRoute} from '@react-navigation/core';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import {Image, ListRenderItem, StyleSheet, View} from 'react-native';

export interface MovieListRouteParams extends RouteProp<ParamListBase, string> {
  params?: {
    path: string;
  };
}

export interface MovieItemParams {
  id: string;
  title: string;
  releaseDate: string;
  rating: string;
}

const styles = StyleSheet.create({
  card: {
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
    width: 92,
    height: 138,
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ratingText: {
    color: 'green',
  },
});

export const MovieItem: React.FunctionComponent<MovieItemParams & CardProps> =
  ({title, releaseDate, rating, ...props}) => {
    return (
      <Card style={styles.card} {...props}>
        <View style={styles.cardWrapper}>
          <Image
            style={styles.cardImage}
            source={{
              uri: 'https://image.tmdb.org/t/p/w92/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            }}
          />
          <View style={styles.cardBody}>
            <Text category="h5">{title}</Text>
            <Text category="s1" appearance="hint">
              {releaseDate}
            </Text>
            <View style={styles.cardGenres}>
              <View style={styles.genrePill}>
                <Text style={styles.genrePillText}>Something's wrong</Text>
              </View>
              <View style={styles.genrePill}>
                <Text style={styles.genrePillText}>Horribly</Text>
              </View>
              <View style={styles.genrePill}>
                <Text style={styles.genrePillText}>Not your kind</Text>
              </View>
            </View>
            <View style={styles.rating}>
              <Text style={styles.ratingText} category="h4">
                {rating}
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

  const renderItem: ListRenderItem<MovieItemParams> = ({item}) => (
    <MovieItem
      onPress={() => navigation.navigate('Details', {id: item.id})}
      {...item}
    />
  );

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <FlatList
        data={[
          {id: '1', title: 'Movie 1', releaseDate: '2016-09-03', rating: '99%'},
          {id: '2', title: 'Movie 2', releaseDate: '2016-09-03', rating: '99%'},
        ]}
        renderItem={renderItem}
      />
    </Layout>
  );
};
