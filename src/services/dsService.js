import { pluckByDataSchemaId, dataSchemas } from "./omegaDataService";

const path = "ds/";

const executeDS = (id, body) => {
  const validBody = JSON.stringify(body);
  return fetch(process.env.API_URL + path + id, {
    body: validBody,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ProductId: process.env.PRODUCT_ID,
      Authorization: "Bearer 00000000-0000-0000-0000-000000000000",
    },
  }).then((response) => response.json());
};

const getContexts = () => {
  const dataSourceId = "53440160-326a-11eb-8521-0b87dfab7e46";

  return executeDS(dataSourceId, {
    productId: process.env.PRODUCT_ID,
  });
};

export { getContexts };
