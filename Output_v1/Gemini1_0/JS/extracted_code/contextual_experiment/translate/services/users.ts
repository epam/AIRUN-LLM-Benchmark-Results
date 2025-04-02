import { RestService } from "./rest";

export const UserService = {
  get: () => RestService.get("/users"),
  update: (data: any) => RestService.put("/users", data),
};