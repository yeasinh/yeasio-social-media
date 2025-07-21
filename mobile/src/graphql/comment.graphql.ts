import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
  query GetComments($postId: String!) {
    getComments(postId: $postId) {
      id
      content
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      content
    }
  }
`;
