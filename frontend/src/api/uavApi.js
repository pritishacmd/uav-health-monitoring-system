import axios from './axios';

export const getAllUavs = async () => {
    const response = await axios.get('/api/uavs');
    return response.data;
};

export const getUavById = async (id) => {
    const response = await axios.get(`/api/uavs/${id}`);
    return response.data;
};

export const createUav = async (uavData) => {
    const response = await axios.post('/api/uavs', uavData);
    return response.data;
};

export const updateUav = async (id, uavData) => {
    const response = await axios.put(`/api/uavs/${id}`, uavData);
    return response.data;
};

export const deleteUav = async (id) => {
    const response = await axios.delete(`/api/uavs/${id}`);
    return response.data;
};