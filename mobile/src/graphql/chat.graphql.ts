import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    getConversations {
      id
      name
      createdAt
      participants {
        id
        name
      }
      messages(last: 1) {
        id
        content
        createdAt
      }
    }
  }
`;
