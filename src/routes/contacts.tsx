import {createFileRoute, Link, Outlet} from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'
import {getContacts} from '../services/api.ts'
import {useCallback, useState} from "react";
import {ContactForm} from "../components/form/ContactForm.tsx";
import {Modal} from "../components/Modal.tsx";

export const Route = createFileRoute('/contacts')({
    component: Index,
})

function Index() {
    const [isOpenModal, setsIsOpenModal] = useState(false)

    const {
        data: contacts,
        isLoading,
        error,
    } = useQuery({queryKey: ['contacts'], queryFn: getContacts})

    const handleCloseModal = useCallback(() => {
        setsIsOpenModal(false)
    }, [])

    if (isLoading) {
        return <span>... loading</span>
    }

    if (error) {
        return <span>{error.message}</span>
    }

    return (
        <>
            <div className="flex h-screen">
                <aside className='w-72 bg-gray-200'>
                    <header className='border-b border-gray-300 px-5 py-3 flex gap-2'>
                        <input
                            id="first-name"
                            name="first-name"
                            type="text"
                            autoComplete="given-name"
                            className="flex-grow rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <button
                            className='justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto'
                            onClick={() => setsIsOpenModal(true)}>
                            New
                        </button>
                    </header>

                    <div className='px-5 py-3'>
                        {contacts?.map((contact) => (
                            <Link
                                key={contact.id}
                                to={contact.id}
                                className='block p-2 data-[status=active]:bg-blue-600 hover:bg-blue-600 rounded-md hover:text-white data-[status=active]:text-white mb-2 last:mb-0'
                            >
                                {contact.name} {contact.lastname}
                            </Link>
                        ))}
                    </div>
                </aside>

                <main className='flex-grow p-6'>
                    <Outlet/>
                </main>
            </div>

            <Modal
                title='Create contact'
                size='lg'
                onClose={handleCloseModal}
                open={isOpenModal}
            >
                <ContactForm onClose={handleCloseModal}/>
            </Modal>
        </>
    )
}
