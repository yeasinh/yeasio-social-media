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
