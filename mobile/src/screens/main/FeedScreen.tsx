import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../graphql/post.graphql';

const FeedScreen = () => {
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  if (loading) return <Text>Loading posts...</Text>;
  if (error) return <Text>Error loading posts.</Text>;

  return (
    <FlatList
      data={data.getAllPosts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.author}>{item.author.name}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.content}</Text>
          {item.mediaUrl && (
            <Image
              source={{ uri: `http://localhost:3000${item.mediaUrl}` }}
              style={styles.image}
            />
          )}
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    margin: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  author: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 15,
    marginVertical: 4,
  },
  image: {
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default FeedScreen;
