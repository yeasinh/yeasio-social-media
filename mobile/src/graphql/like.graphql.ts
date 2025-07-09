import { gql } from '@apollo/client';

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($input: ToggleLikeInput!) {
    toggleLike(input: $input) {
      status
    }
  }
`;

export const GET_LIKES_BY_POST = gql`
  query GetLikesByPost($postId: String!) {
    getLikesByPost(postId: $postId) {
      id
      userId
    }
  }
`;
