import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import CreateGroupScreen from '../screens/chat/CreateGroupScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

export type ChatStackParamList = {
  ChatList: undefined;
  ChatRoom: {
    conversationId: string;
    title: string;
  };
  CreateGroup: undefined;
  UserProfile: any;
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} />
  </Stack.Navigator>
);

export default ChatStack;
