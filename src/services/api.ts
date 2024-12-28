import axios from 'axios';
import { Contact } from "../interfaces/contact.ts";
import { deleteImage, getImageUrl } from "./indexedDB.ts";

const API_URL = 'http://localhost:3000/contacts'

export const getContacts = async (): Promise<Contact[]> => {
    const response = await axios.get<Contact[]>(API_URL)
    return response.data
}

export const getContactById = async (id: string) => {
    const response = await axios.get<Contact>(`${API_URL}/${id}`)
    const contact = response.data

    // Workaround to retrieve saved image URL in mock data environment
    const imageUrl = await getImageUrl(contact.id!)
    contact.avatar = imageUrl || ''

    return contact
}

export const addContact = async (contact: Contact): Promise<Contact> => {
    const response = await axios.post<Contact>(API_URL, contact)
    return response.data
}

export const updateContact = async (contact: Contact): Promise<Contact> => {
    const response = await axios.put<Contact>(`${API_URL}/${contact.id}`, contact)
    return response.data
}

export const deleteContact = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`)
    await deleteImage(id)
}
