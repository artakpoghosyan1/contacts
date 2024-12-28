import {createFileRoute} from '@tanstack/react-router'
import {getContactById} from "../services/api.ts";
import {useCallback, useState} from "react";
import {ContactForm} from "../components/form/ContactForm.tsx";
import {Modal} from "../components/Modal.tsx";
import {useQuery} from "@tanstack/react-query";
import {Button} from "../components/Button.tsx";

export const Route = createFileRoute('/contacts/$contactId')({
    component: RouteComponent,
})

function RouteComponent() {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const {contactId} = Route.useParams()

    const {data: contact, isLoading, error} = useQuery({
        queryKey: ['contact', contactId],
        queryFn: () => getContactById(contactId),
    })

    const handleCloseModal = useCallback(() => {
        setIsOpenModal(false)
    }, [])

    if (isLoading) {
        return <span>... loading</span>
    }

    if (error) {
        return <span>{error.message}</span>
    }

    return <div className='flex gap-5'>
        <div className='w-60'>
            <img
                src={contact.avatar}
                alt={contact.name}
                className='rounded-2xl w-full h-full object-fill'
            />
        </div>

        <div className='flex flex-col gap-5'>
            <h3 className='mb-5 text-2xl/9 font-bold tracking-tight text-gray-900 flex-grow'>
                {contact.name} {contact.lastname}
            </h3>

            <div>
                {contact.description}
            </div>

            <div>
                <Button
                    className='mr-2'
                    onClick={() => setIsOpenModal(true)}
                >
                    Edit
                </Button>
                <Button danger>Delete</Button>
            </div>

            <Modal
                title='Edit contact'
                size='lg'
                onClose={handleCloseModal}
                open={isOpenModal}
            >
                <ContactForm onClose={handleCloseModal} initialData={contact}/>
            </Modal>
        </div>

    </div>
}
