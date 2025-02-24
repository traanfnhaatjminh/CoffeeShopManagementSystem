import axios from 'axios';

const APISERVICECASHIER ={
    ApiProductInHome : async (search="",page=1, limit=10, selectCategory="" )=>{
   return axios.get(`/products/listInHome`,{
    params:{ search,page,limit,selectCategory}
   });
    }
}

export default APISERVICECASHIER;