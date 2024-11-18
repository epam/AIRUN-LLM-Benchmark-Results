import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const RestService = {
  get: (url: string) => instance.get(url),
  post: (url: string, data: any) => instance.post(url, data),
  put: (url: string, data: any) => instance.put(url, data),
  delete: (url: string) => instance.delete(url),
};