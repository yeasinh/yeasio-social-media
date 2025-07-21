import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USERS,
  CREATE_GROUP_CONVERSATION,
} from '../../graphql/chat.graphql';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const CreateGroupScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data, loading } = useQuery(GET_USERS);
  const [createConversation] = useMutation(CREATE_GROUP_CONVERSATION, {
    onCompleted: () => {
      Alert.alert('Group created!');
      navigation.goBack();
    },
    onError: err => Alert.alert('Error', err.message),
  });

  const toggleUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id],
    );
  };

  const handleCreate = () => {
    if (!groupName.trim() || selectedUserIds.length < 1) {
      return Alert.alert('Please enter group name and select at least 1 user');
    }

    createConversation({
      variables: {
        input: {
          name: groupName,
          participantIds: [user!.id, ...selectedUserIds],
        },
      },
    });
  };

  if (loading) return <Text>Loading users...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Group Name</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Enter group name"
      />

      <Text style={styles.label}>Select Users</Text>
      <FlatList
        data={data.getAllUsers.filter((u: any) => u.id !== user?.id)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const selected = selectedUserIds.includes(item.id);
          return (
            <TouchableOpacity
              onPress={() => toggleUser(item.id)}
              style={[
                styles.userItem,
                selected && { backgroundColor: '#cce5ff' },
              ]}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Button title="Create Group" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  userItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default CreateGroupScreen;
