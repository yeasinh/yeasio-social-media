import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_CONVERSATIONS } from '../../graphql/chat.graphql';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../../navigation/ChatStack';

const ChatListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { data, loading, error } = useQuery(GET_CONVERSATIONS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading chats</Text>;

  const renderItem = ({ item }: any) => {
    const otherUsers = item.participants.filter((p: any) => p.id !== userId);
    const name = item.name || otherUsers.map((u: any) => u.name).join(', ');
    const last = item.messages?.[0]?.content || 'No messages yet';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('ChatRoom', {
            conversationId: item.id,
            title: name,
          })
        }
      >
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{last}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data.getConversations}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    marginTop: 4,
    color: '#666',
  },
});

export default ChatListScreen;
