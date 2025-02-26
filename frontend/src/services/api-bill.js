import axios from 'axios';

const APISERVICEBILL = {
  ApiGetBill: async () => {
    return axios.get('/');
  },
  ApiCreateNewBill: async (billData) => {
    return axios.post(`/bills/createBill`,billData);
  },
  ApiGetStatistics: async () => {
    return axios.get('/statistics');
  },
  ApiGetProductsSoldByCategory: async () => {
    return axios.get('/sold-by-category');
  },
  ApiGetBillFromTable: async (tableId) => {
    return axios.get(`/bills/table/${tableId}`);
  },
  ApiPostBillUpdate: async () => {
    return axios.get('/update/:id');
  },
};

export default APISERVICEBILL;
