import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import FeedScreen from '../screens/main/FeedScreen';
import CreatePostScreen from '../screens/main/CreatePostScreen';

const Tab = createBottomTabNavigator();

const ChatScreen = () => (
  <View>
    <Text>Chat</Text>
  </View>
);

const ProfileScreen = () => {
  const dispatch = useDispatch();
  return (
    <View>
      <Text>Profile</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Create" component={CreatePostScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
