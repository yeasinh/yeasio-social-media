import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      image
      bio
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!, $file: Upload) {
    updateProfile(input: $input, file: $file) {
      id
      name
      bio
      image
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      id
      name
      bio
      image
      posts {
        id
        title
        content
        createdAt
      }
    }
  }
`;
