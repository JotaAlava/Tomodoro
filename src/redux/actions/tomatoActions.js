export const actions = {
  CREATETOMATO: "CREATE_TOMATO",
};

export function createTomato(tomato) {
  return { type: actions.CREATETOMATO, tomato };
}
