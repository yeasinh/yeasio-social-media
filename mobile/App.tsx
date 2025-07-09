import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, persistor, RootState } from './src/store';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './src/apollo/client';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import MainTabs from './src/navigation/MainTabs';

const Navigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <MainTabs /> : <AuthStack />;
};

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
