import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      id
      title
      content
      mediaUrl
      createdAt
      author {
        id
        name
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!, $file: Upload) {
    createPost(input: $input, file: $file) {
      id
      title
      content
      mediaUrl
      createdAt
    }
  }
`;
