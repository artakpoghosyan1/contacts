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
        <div>
            <button onClick={() => setsIsOpenModal(true)}>New</button>

            <div className="p-2">
                {contacts?.map((contact) => (
                    <Link
                        key={contact.id}
                        to={contact.id}
                        className='block'
                    >
                        {contact.name}
                    </Link>
                ))}

                <Outlet/>
            </div>

            <Modal
                title='Create contact'
                size='lg'
                onClose={handleCloseModal}
                open={isOpenModal}
            >
                <ContactForm onClose={handleCloseModal} />
            </Modal>
        </div>
    )
}
