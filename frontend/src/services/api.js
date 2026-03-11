import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = () => api.get('/employees');
export const addEmployee = (data) => api.post('/employees', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const getAttendance = (employeeId) => api.get(`/attendance/${employeeId}`);
export const markAttendance = (employeeId, data) => api.post(`/attendance/${employeeId}`, data);

export default api;
