import axios from 'axios';
import {Contact} from "../interfaces/contact.ts";

const API_URL = 'http://localhost:3000/contacts';

export const getContacts = async (): Promise<Contact[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getContactById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const addContact = async (contact: { name: string; email: string }) => {
    const response = await axios.post(API_URL, contact);
    return response.data;
};

export const updateContact = async (contact: { id: number; name: string; email: string }) => {
    const response = await axios.put(`${API_URL}/${contact.id}`, contact);
    return response.data;
};

export const deleteContact = async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
