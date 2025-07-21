import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
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

  const [search, setSearch] = useState('');

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading chats</Text>;

  const filteredData = data?.getMyConversations?.filter((conv: any) =>
    (conv.name || conv.participants?.map((p: any) => p.name).join(', '))
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

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
        <Button
          title="New Group"
          onPress={() => navigation.navigate('CreateGroup')}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{last}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Search chats..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 8,
          margin: 10,
        }}
      />

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
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
