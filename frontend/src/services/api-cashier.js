import axios from 'axios';

const APISERVICECASHIER = {
    ApiProductInHome: async (search = "", page = 1, limit = 10, selectCategory = "") => {
        return axios.get(`/products/listInHome`, {
            params: { search, page, limit, selectCategory }
        });
    },
    ApiProductInWareHouse: async (search = '', page = 1, limit = 6, status = '') => {
        return axios.get(`/products/listall`, {
            params: { search, page, limit, status },
        });
    },
    updateProductStatus: async (productId, status) => {
        return axios.put(`/products/updateStatus/${productId}`, { status });
    },
    ApiCategoryList: async (search = "", page = 1, limit = 10, status = '') => {
        return axios.get(`/categories/list`, {
            params: { search, page, limit, status }
        });
    },

    updateCategoryStatus: async (categoryId, status) => {
        return axios.put(`/categories/inactive/${categoryId}`, { status });
    }
}


export default APISERVICECASHIER;

