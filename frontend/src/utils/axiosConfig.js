import axios from 'axios';
import config from '../config.json';

const { url } = config.server;

const api = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true
});

export default api;
