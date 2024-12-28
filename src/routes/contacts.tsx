import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getContacts } from '../services/api.ts';
import {ChangeEvent, useState} from 'react';
import { ContactForm } from '../components/form/ContactForm.tsx';
import { Modal } from '../components/Modal.tsx';
import { Button } from '../components/Button.tsx';

export const Route = createFileRoute('/contacts')({
    component: Index,
});

function Index() {
    const [isOpenModal, setsIsOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: contacts, isLoading, error } = useQuery({
        queryKey: ['contacts'],
        queryFn: getContacts,
    });

    const handleCloseModal = () => {
        setsIsOpenModal(false);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredContacts = contacts?.filter((contact) => {
        const fullName = `${contact.name} ${contact.lastname}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    if (isLoading) {
        return <span>... loading</span>;
    }

    if (error) {
        return <span>{error.message}</span>;
    }

    return (
        <>
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <aside className="md:w-72 w-full bg-gray-200 overflow-auto h-96 md:h-screen">
                    <header className="border-b border-gray-300 px-5 py-3 flex gap-2">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="flex-grow rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <Button onClick={() => setsIsOpenModal(true)}>New</Button>
                    </header>

                    <div className="px-5 py-3">
                        {filteredContacts?.map((contact) => (
                            <Link
                                key={contact.id}
                                to={contact.id}
                                className="block p-2 data-[status=active]:bg-blue-600 hover:bg-blue-600 rounded-md hover:text-white data-[status=active]:text-white mb-2 last:mb-0"
                            >
                                {contact.name} {contact.lastname}
                            </Link>
                        ))}
                    </div>
                </aside>

                <main className="flex-grow p-6">
                    {contacts && contacts.length === 0 && <h1 className='text-xl'>Add your first contact</h1>}
                    <Outlet />
                </main>
            </div>

            <Modal
                title="Create contact"
                size="lg"
                onClose={handleCloseModal}
                open={isOpenModal}
            >
                <ContactForm onClose={handleCloseModal} />
            </Modal>
        </>
    );
}
