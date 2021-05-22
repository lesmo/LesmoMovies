import React from 'react';
import {ImageProps, SafeAreaView, StyleSheet} from 'react-native';
import {Divider, Icon, Layout, Tab, TabBar, Text} from '@ui-kitten/components';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {RenderProp} from '@ui-kitten/components/devsupport';

import {MovieList} from './MovieList';

const Tabs = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flatList: {
    flex: 1,
  },
});

const UpcomingIcon: RenderProp<Partial<ImageProps>> = props => (
  <Icon {...props} name="calendar-outline" />
);
const PopularIcon: RenderProp<Partial<ImageProps>> = props => (
  <Icon {...props} name="trending-up-outline" />
);
const TopRatedIcon: RenderProp<Partial<ImageProps>> = props => (
  <Icon {...props} name="star-outline" />
);

export const HomeHeader: React.FunctionComponent<MaterialTopTabBarProps> = ({
  navigation,
  state,
}) => (
  <SafeAreaView>
    <Layout style={styles.titleWrapper}>
      <Text category="h1">Movies</Text>
    </Layout>
    <Divider />
    <TabBar
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <Tab title="UPCOMING" icon={UpcomingIcon} />
      <Tab title="POPULAR" icon={PopularIcon} />
      <Tab title="TOP RATED" icon={TopRatedIcon} />
    </TabBar>
  </SafeAreaView>
);

export const HomeScreen: React.FunctionComponent = () => {
  return (
    <Tabs.Navigator tabBar={props => <HomeHeader {...props} />}>
      <Tabs.Screen name="upcoming" component={MovieList} />
      <Tabs.Screen name="popular" component={MovieList} />
      <Tabs.Screen name="top_rated" component={MovieList} />
    </Tabs.Navigator>
  );
};
