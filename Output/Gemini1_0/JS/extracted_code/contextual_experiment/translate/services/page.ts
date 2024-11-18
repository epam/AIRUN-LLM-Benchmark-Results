import { RestService } from "./rest";

export const PageService = {
  getPage: (url: string) => RestService.get(`/content/${url}`),
};