import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { SHARE_POST } from '../graphql/post.graphql';

const SharePostModal = ({
  visible,
  onClose,
  postId,
}: {
  visible: boolean;
  onClose: () => void;
  postId: string;
}) => {
  const [text, setText] = useState('');

  const [sharePost] = useMutation(SHARE_POST, {
    onCompleted: () => {
      Alert.alert('Shared!');
      setText('');
      onClose();
    },
    onError: err => Alert.alert('Error', err.message),
  });

  const handleShare = () => {
    sharePost({
      variables: {
        input: {
          postId,
          title: '',
          content: text,
        },
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.header}>Share this post</Text>
          <TextInput
            style={styles.input}
            placeholder="Say something..."
            value={text}
            onChangeText={setText}
            multiline
          />
          <Button title="Share" onPress={handleShare} />
          <Button title="Cancel" onPress={onClose} color="gray" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
  },
  modal: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 },
  header: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
});

export default SharePostModal;
