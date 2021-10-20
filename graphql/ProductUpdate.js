import {gql} from 'apollo-boost';

export const ProductUpdatemutation = gql`
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        description
        title
        variants(first:10) {
          edges {
            node {
              price
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;