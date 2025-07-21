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
  Image,
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
import { launchImageLibrary } from 'react-native-image-picker';
import formDataAppendFile from 'apollo-upload-client/formDataAppendFile.mjs';

const ChatRoomScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const route = useRoute<RouteProp<ChatStackParamList, 'ChatRoom'>>();
  const { conversationId, title } = route.params;

  const [text, setText] = useState('');
  const [file, setFile] = useState<any>(null);
  const [search, setSearch] = useState('');

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

  const messages = data?.getMessages?.filter((msg: any) =>
    msg.content.toLowerCase().includes(search.toLowerCase()),
  );

  const pickFile = () => {
    launchImageLibrary({ mediaType: 'mixed' }, response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setFile({
          uri: asset.uri!,
          type: asset.type!,
          name: asset.fileName!,
        });
      }
    });
  };

  const handleSend = async () => {
    if (!text.trim() && !file) return;

    const variables: any = {
      input: {
        conversationId,
        content: text,
      },
    };

    // Apollo will automatically handle file if it's in variables
    if (file) {
      variables.file = {
        uri: file.uri,
        type: file.type,
        name: file.name,
      };
    }

    await sendMessage({ variables });

    setText('');
    setFile(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TextInput
        placeholder="Search messages..."
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
        data={messages}
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

            {item.mediaUrl && (
              <Image
                source={{ uri: `http://localhost:3000${item.mediaUrl}` }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 8,
                  marginTop: 8,
                }}
              />
            )}

            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
      />

      {file && (
        <View style={{ padding: 10 }}>
          <Text>📎 {file.name}</Text>
        </View>
      )}

      <View style={styles.inputBox}>
        <Button title="📎" onPress={pickFile} />
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
