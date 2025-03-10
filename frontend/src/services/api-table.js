import axios from 'axios';

const APITABLE = {
  ApiGetAll: async () => {
    return axios.get('/tables/list');
  },
  ApiCreateTable: async () => {
    return axios.post('/createTable'); // POST thay vì GET nếu tạo mới
  },
  ApiUpdateTable: async (idTables, data) => {
    return axios.put(`/update/${idTables}`, data);
  },
  ApiUpdateStatusTable: async (tableId, status) => {
    return axios.put(`/tables/updateStatus/${tableId}`, { status });
  },
  ApiDelete: async (idTables) => {
    return axios.delete(`/delete/${idTables}`); // DELETE thay vì GET
  },
  ApiUpdateTableView: async (tableId, position) => {
    return axios.put(`/tables/${tableId}`, position, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

export default APITABLE;
