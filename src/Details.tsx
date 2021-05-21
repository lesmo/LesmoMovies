import React from 'react';
import {ImageProps, SafeAreaView, StyleSheet} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {RenderProp} from '@ui-kitten/components/devsupport';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const BackIcon: RenderProp<Partial<ImageProps>> = props => (
  <Icon {...props} name="arrow-back" />
);

export const DetailsScreen: React.FunctionComponent = () => {
  const navigation = useNavigation();
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction: RenderProp = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        title="Lesmo Movies"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout>
        <Text category="h1">DETAILS</Text>
      </Layout>
    </SafeAreaView>
  );
};
