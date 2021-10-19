import { useState, useMemo, useCallback } from "react";
import { Button, Card, DataTable, EmptyState, Frame, Heading, Page, Stack,Toast, TextField } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useMutation } from "react-apollo";
import { ProductUpdatemutation } from "../graphql/ProductUpdate";

const Index = () => {

  const [appendToTitle, setAppendToTitle] = useState('');
  const [appendToDescription, setAppendToDescription] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const [updateProduct] = useMutation(ProductUpdatemutation);

  // console.log(products);
  
  const productTableDisplayData = useMemo(() => (products.map((product) => [
    product.id, 
    product.title, 
    `${product.title}${appendToTitle}`,
    product.descriptionHtml,
    `${product.descriptionHtml}${appendToDescription}`,  
  ])), [products, appendToTitle, appendToDescription]);

  // console.log(products);


  const submitHandler = useCallback(() => {
    let count = 0;
    const runMutation = (product) => {
      updateProduct({
        variables: {
          input: {
            descriptionHtml: `${product.descriptionHtml}${appendToDescription}`,
            title: `${product.title}${appendToTitle}`,
            id: product.id
          }
        }
      }).then((data) => {
        console.log(products);
        console.log('Update Product', count, data);
        count++;
        if (products[count]) {
          runMutation(products[count])
        } else {
          console.log(('Update Complete'));
          setShowToast(true);
        }
      })
    }
    runMutation(products[count]);
  }, [products, appendToTitle, appendToDescription]);

  const toastMarkup = showToast ? 
    <Toast
      content="Update Successful"
      onDismiss={() => setShowToast(false)}
      duration={4000}
    /> : null;

  return (
    <Frame>
      <Page>
        <Heading>Product Updater App</Heading>
        <Card>
          <Card.Section>
            <Stack vertical>
              <TextField
                label="Append to title"
                value={appendToTitle}
                onChange={setAppendToTitle}
              />
              <TextField
                label="Append to description"
                value={appendToDescription}
                onChange={setAppendToDescription}
                multiline={3}
              />
              <ResourcePicker
                resourceType="Product"
                showVariants={false}
                open={pickerOpen}
                onSelection={(resources) => {
                  setProducts(resources.selection);
                }}
              />
              <Button primary onClick={() => setPickerOpen(true)}>Select Products</Button>
            </Stack>  
          </Card.Section>
          <Card.Section>
            {productTableDisplayData.length ? <DataTable
              columnContentTypes={['text','text','text','numeric','numeric']}
              headings={['ID', 'Old Title', 'New Title', 'Old Description', 'New Description', 'Old Price', 'New Price']}
              rows={productTableDisplayData}
            /> : <EmptyState heading="no products selection"/>}
          </Card.Section>
          <Card.Section>
            <Button primary onClick={submitHandler} disabled={!products.length}>Submit</Button>
          </Card.Section>
        </Card>
        {toastMarkup}
      </Page>
    </Frame>
  );

};

export default Index;