import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, UPDATE_PROFILE } from '../../graphql/user.graphql';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const { data, loading, refetch } = useQuery(GET_ME);
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const user = data?.me;
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [file, setFile] = useState<any>(null);

  const pickPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      const asset = res.assets?.[0];
      if (asset) {
        setFile({
          uri: asset.uri!,
          name: asset.fileName!,
          type: asset.type!,
        });
      }
    });
  };

  const handleUpdate = async () => {
    try {
      await updateProfile({
        variables: {
          input: { name, bio },
          file,
        },
      });
      Alert.alert('Updated!');
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user?.image && (
        <Image
          source={{ uri: `http://localhost:3000${user.image}` }}
          style={styles.avatar}
        />
      )}

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Your name"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        style={[styles.input, { height: 100 }]}
        placeholder="Your bio"
        multiline
      />

      {file && (
        <Text style={{ marginBottom: 10 }}>📎 Selected: {file.name}</Text>
      )}
      <Button title="Pick Profile Photo" onPress={pickPhoto} />
      <View style={{ height: 10 }} />
      <Button title="Update Profile" onPress={handleUpdate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
});

export default ProfileScreen;
