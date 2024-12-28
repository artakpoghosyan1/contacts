import axios from 'axios';
import {Contact} from "../interfaces/contact.ts";
import {deleteImage, getImageUrl} from "./indexedDB.ts";

const API_URL = 'http://localhost:3000/contacts';

export const getContacts = async (): Promise<Contact[]> => {
    const response = await axios.get(API_URL)
    return response.data
}

export const getContactById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`)
    const contact = response.data

    // workaround to retrieve saved image url in mock data environment
    const imageUrl = await getImageUrl(contact.id)
    contact.avatar = imageUrl || ''

    return contact
}

export const addContact = async (contact: Contact) => {
    const response = await axios.post(API_URL, contact)
    return response.data
}

export const updateContact = async (contact: Contact) => {
    const response = await axios.put(`${API_URL}/${contact.id}`, contact)
    return response.data
}

export const deleteContact = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`)
    await deleteImage(id)
    return response.data
}
