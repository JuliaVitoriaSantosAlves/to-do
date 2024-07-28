import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:5000/tasks';

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await axios.post(API_URL, task);
    return response.data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await axios.patch(`${API_URL}/${id}`, updates);
    return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
