import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../../graphql/post.graphql';
import * as ImagePicker from 'react-native-image-picker';

export class ReactNativeFile {
  uri: string;
  type: string;
  name: string;

  constructor({
    uri,
    type,
    name,
  }: {
    uri: string;
    type: string;
    name: string;
  }) {
    this.uri = uri;
    this.type = type;
    this.name = name;
  }
}

const CreatePostScreen = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<any>(null);

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      Alert.alert('Success', 'Post created!');
      setForm({ title: '', content: '' });
      setFileUri(null);
      setFileObj(null);
    },
    onError: err => {
      Alert.alert('Error', err.message);
    },
  });

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      res => {
        if (res.didCancel || !res.assets) return;
        const asset = res.assets[0];
        setFileUri(asset.uri || null);

        if (asset.fileName && asset.uri && asset.type) {
          const file = new ReactNativeFile({
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
          });
          setFileObj(file);
        }
      },
    );
  };

  const handleSubmit = () => {
    if (!form.title || !form.content) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    createPost({
      variables: {
        input: form,
        file: fileObj,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={form.title}
        onChangeText={text => setForm({ ...form, title: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Content"
        multiline
        value={form.content}
        onChangeText={text => setForm({ ...form, content: text })}
        style={[styles.input, { height: 100 }]}
      />
      {fileUri && <Image source={{ uri: fileUri }} style={styles.preview} />}
      <Button title="Choose Image" onPress={pickImage} />
      <Button
        title={loading ? 'Posting...' : 'Post'}
        onPress={handleSubmit}
        color="green"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
});

export default CreatePostScreen;
