import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './src/apollo/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Text, View } from 'react-native';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View>
            <Text>Yeasio App</Text>
          </View>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
