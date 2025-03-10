import axios from 'axios';

const APISERVICECASHIER = {
  ApiProductInHome: async (search = '', page = 1, limit = 10, selectCategory = '') => {
    return axios.get(`/products/listInHome`, {
      params: { search, page, limit, selectCategory },
    });
  },
  ApiProductInWareHouse: async (search = '', page = 1, limit = 10, status = '') => {
    return axios.get(`/products/listall`, {
      params: { search, page, limit, status },
    });
  },
};

export default APISERVICECASHIER;
