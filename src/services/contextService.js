import { pluckByDataSchemaId, dataSchemas } from "./omegaDataService";
export const contextService = {
  getContexts: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var result = {
          statusCode: 200,
          result: [
            {
              itemId: "183BF6D0-67DD-11EC-A6FE-4B30CEA17D9F",
              name: "TEST Context 1",
              description: "TEST Context 1",
              productId: "9AE2E3ED-01E3-4A9D-A1BE-7D7543FF6099",
              deleted: false,
              ownerId: "00000000-0000-0000-0000-000000000000",
              data: [
                {
                  dataSchemaId: "BA0D22F8-2053-470D-8B82-4BCA8077212C",
                  tomatoContext: {
                    tomatoContextId: 1,
                    created: null,
                    createdBy: null,
                    default: false,
                    label: "test 1",
                    private: false,
                    deleted: false,
                  },
                },
              ],
            },
            {
              itemId: "283BF6D0-67DD-11EC-A6FE-4B30CEA17D9F",
              name: "TEST Context 2",
              description: "TEST Context 2",
              productId: "9AE2E3ED-01E3-4A9D-A1BE-7D7543FF6099",
              deleted: false,
              ownerId: "00000000-0000-0000-0000-000000000000",
              data: [
                {
                  dataSchemaId: "BA0D22F8-2053-470D-8B82-4BCA8077212C",
                  tomatoContext: {
                    tomatoContextId: 2,
                    created: null,
                    createdBy: null,
                    default: true,
                    label: "test 2",
                    private: false,
                    deleted: false,
                  },
                },
              ],
            },
            {
              itemId: "383BF6D0-67DD-11EC-A6FE-4B30CEA17D9F",
              name: "TEST Context 3",
              description: "TEST Context 3",
              productId: "9AE2E3ED-01E3-4A9D-A1BE-7D7543FF6099",
              deleted: false,
              ownerId: "00000000-0000-0000-0000-000000000000",
              data: [
                {
                  dataSchemaId: "BA0D22F8-2053-470D-8B82-4BCA8077212C",
                  tomatoContext: {
                    tomatoContextId: 3,
                    created: null,
                    createdBy: null,
                    default: true,
                    label: "test 3",
                    private: true,
                    deleted: false,
                  },
                },
              ],
            },
          ],
        };

        return resolve(pluckByDataSchemaId(dataSchemas.tomatoContext, result));
      }, 2000);
    });
  },
  saveContext: (newContext) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(newContext);
      }, 2000);
    });
  },
};
