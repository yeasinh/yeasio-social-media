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

export const GET_USERS = gql`
  query GetUsers {
    getAllUsers {
      id
      name
    }
  }
`;

export const CREATE_GROUP_CONVERSATION = gql`
  mutation CreateGroupConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      name
      participants {
        id
        name
      }
    }
  }
`;
