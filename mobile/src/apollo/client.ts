import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import Config from 'react-native-config';

const httpLink = createUploadLink({
  uri: Config.API_URL,
}) as any;

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
