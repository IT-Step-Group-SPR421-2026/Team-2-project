import axios from 'axios';
import { API_BASE_URL } from '../constants';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? API_BASE_URL,
});

export default httpClient;
