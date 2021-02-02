import Store from "electron-store"

export const store = new Store({
  schema: {
    foo: {
      type: "number",
      maximum: 100,
      minimum: 1,
      default: 50,
    },
  },
})
