import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: String!) {
    getMessages(conversationId: $conversationId) {
      id
      content
      mediaUrl
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage($conversationId: String!) {
    newMessage(conversationId: $conversationId) {
      id
      content
      createdAt
      sender {
        id
        name
      }
    }
  }
`;
