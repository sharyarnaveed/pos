import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true // Enable sending credentials by default
  });


  export default api; 