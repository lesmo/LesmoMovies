import React, {useState} from 'react';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet} from 'react-native';
import {
  Button,
  Divider,
  Layout,
  Tab,
  TabBar,
  TabBarProps,
  Text,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleWrapper: {
    padding: 20,
  },
  flatList: {
    flex: 1,
  },
});

const HomeHeader: React.FunctionComponent<TabBarProps> = ({...props}) => (
  <>
    <Layout style={styles.titleWrapper}>
      <Text category="h1">Movies</Text>
    </Layout>
    <Divider />
    <TabBar {...props}>
      <Tab title="UPCOMING" />
      <Tab title="POPULAR" />
      <Tab title="TOP RATED" />
    </TabBar>
  </>
);

export const HomeScreen: React.FunctionComponent = () => {
  const navigation = useNavigation();

  const [tabIndex, setTabIndex] = useState(0);

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  const renderItem: ListRenderItem<{}> = () => (
    <Layout>
      <Button onPress={navigateDetails}>OPEN DETAILS</Button>
    </Layout>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.flatList}
        ListHeaderComponent={
          <HomeHeader
            selectedIndex={tabIndex}
            onSelect={index => setTabIndex(index)}
          />
        }
        data={[{key: 0}]}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};
