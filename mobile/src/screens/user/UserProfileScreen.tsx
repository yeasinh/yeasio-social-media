import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../graphql/user.graphql';

const UserProfileScreen = () => {
  const { params } = useRoute<any>();
  const { userId } = params;

  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  });

  if (loading) return <Text>Loading...</Text>;

  const user = data.getUserById;

  return (
    <View style={styles.container}>
      {user.image && (
        <Image
          source={{ uri: `http://localhost:3000${user.image}` }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.name}>{user.name}</Text>
      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

      <Text style={styles.heading}>Posts</Text>
      <FlatList
        data={user.posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  bio: { textAlign: 'center', marginVertical: 10 },
  heading: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  post: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  postTitle: { fontWeight: 'bold' },
});

export default UserProfileScreen;
