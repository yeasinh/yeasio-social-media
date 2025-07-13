import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_COMMENTS,
  CREATE_COMMENT,
  DELETE_COMMENT,
} from '../graphql/comment.graphql';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../navigation/ChatStack';

const CommentSection = ({ postId }: { postId: string }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();

  const user = useSelector((state: RootState) => state.auth.user);

  const [text, setText] = useState('');

  const { data, refetch } = useQuery(GET_COMMENTS, { variables: { postId } });

  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setText('');
      refetch();
    },
    onError: err => Alert.alert('Error', err.message),
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => refetch(),
  });

  const handleSend = () => {
    if (!text.trim()) return;

    createComment({
      variables: {
        input: { content: text, postId },
      },
    });
  };

  const handleDelete = (commentId: string) => {
    deleteComment({ variables: { commentId } });
  };

  return (
    <View style={{ marginTop: 12 }}>
      <FlatList
        data={data?.getComments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentBox}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserProfile', { userId: user.id })
              }
            >
              <Text style={styles.commentAuthor}>{item.user.name}</Text>
            </TouchableOpacity>
            <Text>{item.content}</Text>
            <Text style={styles.commentTime}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
            {item.user.id === user?.id && (
              <Button title="Delete" onPress={() => handleDelete(item.id)} />
            )}
          </View>
        )}
      />
      <TextInput
        placeholder="Add a comment..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  commentBox: {
    padding: 6,
    backgroundColor: '#eee',
    marginBottom: 8,
    borderRadius: 6,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 10,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
    borderRadius: 6,
    borderColor: '#ccc',
  },
});

export default CommentSection;
