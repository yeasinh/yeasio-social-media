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

export const SHARE_POST = gql`
  mutation SharePost($input: SharePostInput!) {
    sharePost(input: $input) {
      id
      title
      content
      sharedFrom {
        id
        content
        mediaUrl
        author {
          name
        }
      }
    }
  }
`;
