import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import { http, ROOT_STORAGE } from '../constants';

export default async (authToken) => {
  // Check if a token has already been saved
  await AsyncStorage.removeItem(`${ROOT_STORAGE}pushToken`);
  const previousToken = await AsyncStorage.getItem(`${ROOT_STORAGE}pushToken`);

  if (previousToken) {
    return 'granted';
  }

  const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
  if (status !== 'granted') {
    return status;
  }

  const pushToken = await Notifications.getExponentPushTokenAsync();
  // await http.post('/savePushToken', {
  //   pushToken,
  //   authorization: authToken,
  // });

  AsyncStorage.setItem(`${ROOT_STORAGE}pushToken`, pushToken);
  // console.log('pushToken: ', pushToken);
  return status;
};
