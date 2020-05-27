import axios from "axios";
import config from "./config";

const client = axios.create({
  baseURL: config.API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default client;