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
