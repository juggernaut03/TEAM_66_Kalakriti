// src/utils/networkUtils.js
import NetInfo from '@react-native-community/netinfo';

export const checkNetworkConnection = async () => {
  const networkState = await NetInfo.fetch();
  return networkState.isConnected && networkState.isInternetReachable;
};