import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, persistor, RootState } from './src/store';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './src/apollo/client';
import { PersistGate } from 'redux-persist/integration/react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme,
} from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import MainTabs from './src/navigation/MainTabs';

// A small wrapper to read darkMode from Redux
const AppNavigator = () => {
  const darkMode = useSelector((state: RootState) => state.settings.darkMode);
  const theme: Theme = darkMode ? DarkTheme : DefaultTheme;
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <NavigationContainer theme={theme}>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => (
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  </ApolloProvider>
);

export default App;
