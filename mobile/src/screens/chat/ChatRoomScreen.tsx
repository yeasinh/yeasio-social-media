import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  GET_MESSAGES,
  SEND_MESSAGE,
  MESSAGE_SUBSCRIPTION,
} from '../../graphql/message.graphql';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ChatStackParamList } from '../../navigation/ChatStack';

const ChatRoomScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const route = useRoute<RouteProp<ChatStackParamList, 'ChatRoom'>>();
  const { conversationId, title } = route.params;

  const [text, setText] = useState('');

  const { data, loading, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { conversationId },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { conversationId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMsg = subscriptionData.data.newMessage;
        return {
          getMessages: [...prev.getMessages, newMsg],
        };
      },
    });
    return () => unsubscribe();
  }, [conversationId]);

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage({
      variables: {
        input: {
          conversationId,
          content: text,
        },
      },
    });
    setText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        data={data?.getMessages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBox,
              item.sender.id === user?.id ? styles.mine : styles.theirs,
            ]}
          >
            <Text style={styles.sender}>{item.sender.name}</Text>
            <Text>{item.content}</Text>
            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
      />

      <View style={styles.inputBox}>
        <TextInput
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageBox: {
    margin: 8,
    padding: 10,
    borderRadius: 8,
    maxWidth: '70%',
  },
  mine: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  theirs: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  time: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
  },
  inputBox: {
    flexDirection: 'row',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
});

export default ChatRoomScreen;
