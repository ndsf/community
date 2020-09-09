import gql from "graphql-tag";

export const FETCH_GROUPS_QUERY = gql`
  {
    getGroups {
      id
      body
      createdAt
      username
      bio
      avatar
      posts {
        id
        username
        title
        body
        createdAt
      }
      likeCount
      likes {
        id
        createdAt
        username
      }
      admins {
        createdAt
        username
      }
    }
  }
`;

export const FETCH_GROUPS_BY_BODY_QUERY = gql`
  query getGroupsByBody($keyword: String!) {
    getGroupsByBody(keyword: $keyword) {
      id
      body
      createdAt
      username
      bio
      avatar

      likeCount
      likes {
        createdAt
        username
      }
      admins {
        createdAt
        username
      }
    }
  }
`;

export const FETCH_USER_QUERY = gql`
    query getUser($username: String!) {
        getUser(username: $username) {
            id
            username
            email
            createdAt
            isTeacher
            notifications {
                id
                body
                createdAt
                username
            }
        }
    }
`;