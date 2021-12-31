import { pluckByDataSchemaId, dataSchemas } from "./omegaDataService";
import * as itemService from "./itemService";
import * as dsService from "./dsService";

export const contextService = {
  getContexts: () => {
    return new Promise((resolve, reject) => {
      return dsService.getContexts().then((result) => {
        resolve(pluckByDataSchemaId(dataSchemas.tomatoContext, result));
      });
    });
  },
  saveContext: (newContext) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("testing"));
        // resolve(newContext);
      }, 2000);
    });
  },
};
