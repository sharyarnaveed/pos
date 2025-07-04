import axios from 'axios';


const api = axios.create({
    baseURL: 'https://admin.burjalsama.site',
    withCredentials: true // Enable sending credentials by default
  });


  export default api; 