import {gql} from 'apollo-boost';

export const ProductUpdatemutation = gql`
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        description
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;