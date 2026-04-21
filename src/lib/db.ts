import { createAPI } from "localmockdb";

export const db = createAPI({
  namespace: "localmockdb-react-demo",
  persist: true,
  storage: "localStorage",
});