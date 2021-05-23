import React, {useEffect, useState} from 'react';
import {Image, ImageProps, SafeAreaView, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Divider,
  Icon,
  Layout,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RenderProp} from '@ui-kitten/components/devsupport';
import {ScrollView} from 'react-native-gesture-handler';
import {MovieCredit, MovieDetailItem, TMDBApi} from './services/tmdb';

export interface MovieDetailRouteParams
  extends RouteProp<ParamListBase, string> {
  params: {
    id: number;
  };
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  posterSection: {
    alignItems: 'center',
  },
  posterImage: {
    width: 92 * 2,
    height: 132 * 2,
    borderRadius: 10,
  },
  posterText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  posterRating: {
    color: 'green',
  },
  genresSection: {
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
  creditScrollview: {
    marginHorizontal: -20,
  },
  creditItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    width: 60,
    flexWrap: 'wrap',
  },
  creditItemText: {
    textAlign: 'center',
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
});

const BackIcon: RenderProp<Partial<ImageProps>> = props => (
  <Icon {...props} name="arrow-back" />
);

const CreditItem: React.FunctionComponent<MovieCredit> = ({
  name,
  profileUrl,
}) => (
  <View style={styles.creditItem}>
    <Avatar
      size="giant"
      source={{
        uri: profileUrl(0).href,
      }}
    />
    <Text style={styles.creditItemText}>{name}</Text>
  </View>
);

export const DetailsScreen: React.FunctionComponent = () => {
  const navigation = useNavigation();
  const [movie, setMovie] = useState<MovieDetailItem | undefined>(undefined);

  const navigateBack = () => {
    navigation.goBack();
  };

  const route = useRoute<MovieDetailRouteParams>();

  const BackAction: RenderProp = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  useEffect(() => {
    TMDBApi.getMovieDetail(route.params.id).then(_movie => {
      setMovie(_movie);
    });
  }, [route.params.id]);

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation accessoryLeft={BackAction} />
      <Divider />
      <Layout style={styles.container}>
        {!movie ? (
          <View style={[styles.section, styles.posterSection]}>
            <Spinner size="giant" />
          </View>
        ) : (
          <ScrollView>
            <View style={[styles.section, styles.posterSection]}>
              <Image
                style={styles.posterImage}
                source={{
                  uri: movie.posterUrl(3).href,
                }}
              />
              <Text style={styles.posterText} category="h3">
                {movie.title}
              </Text>
              <Text
                style={[styles.posterText, styles.posterRating]}
                category="h4">
                {movie.voteAverage}
              </Text>
            </View>
            <View style={styles.section}>
              <Text category="h5">Overview</Text>
              <Text>{movie.overview}</Text>
            </View>
            <View style={styles.section}>
              <Text category="h5">Genres</Text>
              <View style={styles.genresSection}>
                {movie.genres.map(genre => (
                  <View key={genre} style={styles.genrePill}>
                    <Text style={styles.genrePillText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text category="h5">Credits</Text>
              <ScrollView horizontal style={styles.creditScrollview}>
                {movie.credits.cast.map(credit => (
                  <CreditItem key={credit.id} {...credit} />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </Layout>
    </SafeAreaView>
  );
};
