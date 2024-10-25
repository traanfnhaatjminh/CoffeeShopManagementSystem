// authSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async (formData) => {
    const response = await axios.post('/api/auth/login', formData);
    return response.data;
});
