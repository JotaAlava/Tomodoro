import { pluckByDataSchemaId, dataSchemas } from "./omegaDataService";

const path = "item/";

const getItems = () => {
  return fetch(process.env.API_URL + path, {
    headers: {
      Authorization: "Bearer j0t@",
      //   IdToken: "j0t@",
      ProductId: process.env.PRODUCT_ID,
    },
  }).then((response) => response.json());
};

const getItemById = (id) => {
  return fetch(process.env.API_URL + path + id, {
    headers: {
      Authorization: "Bearer j0t@",
      //   IdToken: "j0t@",
      ProductId: process.env.PRODUCT_ID,
    },
  }).then((response) => response.json());
};

const postItem = (body) => {
  const validBody = JSON.stringify(body);
  return fetch(process.env.API_URL + path, {
    body: validBody,
    method: "POST",
    headers: {
      Authorization: "Bearer j0t@",
      //   IdToken: "j0t@",
      ProductId: process.env.PRODUCT_ID,
    },
  }).then((response) => response.json());
};

export { getItems, postItem, getItemById };
