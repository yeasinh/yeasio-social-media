import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../graphql/post.graphql';
import { TOGGLE_LIKE, GET_LIKES_BY_POST } from '../../graphql/like.graphql';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CommentSection from '../../components/CommentSection';
import SharePostModal from '../../components/SharePostModal';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../../navigation/ChatStack';

const LikeButton = ({ postId }: { postId: string }) => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data, refetch } = useQuery(GET_LIKES_BY_POST, {
    variables: { postId },
  });

  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    onCompleted: () => refetch(),
  });

  const isLiked = data?.getLikesByPost?.some(
    (like: any) => like.userId === userId,
  );
  const likeCount = data?.getLikesByPost?.length || 0;

  const handleLike = () => {
    toggleLike({ variables: { input: { postId } } });
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
      <Text onPress={handleLike} style={{ fontSize: 18 }}>
        {isLiked ? '❤️' : '🤍'}
      </Text>
      <Text style={{ marginLeft: 6 }}>
        {likeCount} like{likeCount !== 1 ? 's' : ''}
      </Text>
    </View>
  );
};

const FeedScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();

  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  if (loading) return <Text>Loading posts...</Text>;
  if (error) return <Text>Error loading posts.</Text>;

  <SharePostModal
    visible={!!selectedPost}
    postId={selectedPost!}
    onClose={() => setSelectedPost(null)}
  />;

  return (
    <FlatList
      data={data.getAllPosts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserProfile', { userId: item.author.id })
            }
          >
            <Text style={styles.author}>{item.author.name}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.content}</Text>

          {item.sharedFrom && (
            <View
              style={{
                marginTop: 6,
                padding: 8,
                backgroundColor: '#f0f0f0',
                borderRadius: 6,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>
                {item.sharedFrom.author?.name || 'Unknown'}'s post
              </Text>
              <Text>{item.sharedFrom.content}</Text>
              {item.sharedFrom.mediaUrl && (
                <Image
                  source={{
                    uri: `http://localhost:3000${item.sharedFrom.mediaUrl}`,
                  }}
                  style={[styles.image, { marginTop: 6 }]}
                />
              )}
            </View>
          )}

          {item.mediaUrl && (
            <Image
              source={{ uri: `http://localhost:3000${item.mediaUrl}` }}
              style={styles.image}
            />
          )}
          <LikeButton postId={item.id} />
          <CommentSection postId={item.id} />
          <Button title="Share" onPress={() => setSelectedPost(item.id)} />
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
