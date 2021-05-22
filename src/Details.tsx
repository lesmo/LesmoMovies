import React from 'react';
import {Image, ImageProps, SafeAreaView, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Card,
  Divider,
  Icon,
  Layout,
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

export interface MovieDetailRouteParams
  extends RouteProp<ParamListBase, string> {
  params?: {
    id: string;
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

const CreditItem: React.FunctionComponent = () => (
  <View style={styles.creditItem}>
    <Avatar
      size="giant"
      source={{
        uri: 'https://image.tmdb.org/t/p/w92//5XBzD5WuTyVQZeS4VI25z2moMeY.jpg',
      }}
    />
    <Text style={styles.creditItemText}>What a long Name</Text>
  </View>
);

export const DetailsScreen: React.FunctionComponent = () => {
  const navigation = useNavigation();
  const navigateBack = () => {
    navigation.goBack();
  };

  const route = useRoute<MovieDetailRouteParams>();

  const BackAction: RenderProp = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation accessoryLeft={BackAction} />
      <Divider />
      <Layout style={styles.container}>
        <ScrollView>
          <View style={[styles.section, styles.posterSection]}>
            <Image
              style={styles.posterImage}
              source={{
                uri: 'https://image.tmdb.org/t/p/w92/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
              }}
            />
            <Text style={styles.posterText} category="h3">
              Movie Title
            </Text>
            <Text
              style={[styles.posterText, styles.posterRating]}
              category="h4">
              99%
            </Text>
          </View>
          <View style={styles.section}>
            <Text category="h5">Overview</Text>
            <Text>Some wonderful description</Text>
          </View>
          <View style={styles.section}>
            <Text category="h5">Genres</Text>
            <View style={styles.genresSection}>
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
          </View>
          <View style={styles.section}>
            <Text category="h5">Credits</Text>
            <ScrollView horizontal style={styles.creditScrollview}>
              <CreditItem />
              <CreditItem />
              <CreditItem />
              <CreditItem />
              <CreditItem />
              <CreditItem />
              <CreditItem />
              <CreditItem />
              <CreditItem />
            </ScrollView>
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
