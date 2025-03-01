import { gql } from 'graphql-request';
import { request } from 'graphql-request';

// Set your GraphQL endpoint (replace with the actual URL)
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql'; // or your production URL

// Example GraphQL query to get resume data
export const GET_RESUME = gql`
  query GetResume($id: ID!) {
    resume(id: $id) {
      name
      content
      uploadedAt
    }
  }
`;

// Function to make a GraphQL request to get a resume
export const fetchResume = async (id) => {
  try {
    const data = await request(GRAPHQL_ENDPOINT, GET_RESUME, { id });
    return data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

// Example GraphQL mutation to upload a resume
export const UPLOAD_RESUME = gql`
  mutation UploadResume($file: Upload!) {
    uploadResume(file: $file) {
      url
      success
    }
  }
`;

// Function to upload a resume via GraphQL
export const uploadResumeGraphQL = async (file) => {
  try {
    const data = await request(GRAPHQL_ENDPOINT, UPLOAD_RESUME, { file });
    return data;
  } catch (error) {
    console.error('Error uploading resume via GraphQL:', error);
    throw error;
  }
};
