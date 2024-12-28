import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { deleteContact, getContactById } from '../services/api.ts';
import { useCallback, useState } from 'react';
import { ContactForm } from '../components/form/ContactForm.tsx';
import { Modal } from '../components/Modal.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/Button.tsx';

export const Route = createFileRoute('/contacts/$contactId')({
    component: RouteComponent,
});

function RouteComponent() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    const { contactId } = Route.useParams()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate, isPending, error: mutationError } = useMutation({
        mutationFn: deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            navigate({ to: '/contacts' });
        },
        onError: (error) => {
            console.error('Error deleting contact:', error);
        },
    })

    const { data: contact, isLoading, error } = useQuery({
        queryKey: ['contacts', contactId],
        queryFn: () => getContactById(contactId),
    })

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
    }

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false)
    }

    const handleConfirmDelete = useCallback(() => {
        if (contact?.id) {
            mutate(contact.id);
            setIsConfirmModalOpen(false);
        }
    }, [contact?.id, mutate]);

    if (isLoading) {
        return <span>... loading</span>
    }

    if (error) {
        return <span>{error.message}</span>
    }

    return (
        <div className="flex gap-5">
            <div className="w-60">
                <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="rounded-2xl w-full h-full object-fill"
                />
            </div>

            <div className="flex flex-col gap-5">
                <h3 className="mb-5 text-2xl/9 font-bold tracking-tight text-gray-900 flex-grow">
                    {contact.name} {contact.lastname}
                </h3>

                <p>{contact.description}</p>

                <div>
                    <Button
                        className="mr-2"
                        onClick={() => setIsEditModalOpen(true)}
                        disabled={isPending}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        onClick={() => setIsConfirmModalOpen(true)}
                        disabled={isPending}
                    >
                        Delete
                    </Button>
                </div>

                {mutationError && (
                    <p className="text-red-700">{mutationError.message}</p>
                )}
            </div>

            <Modal
                title="Edit contact"
                size="lg"
                onClose={handleCloseEditModal}
                open={isEditModalOpen}
            >
                <ContactForm onClose={handleCloseEditModal} initialData={contact} />
            </Modal>

            <Modal
                title="Confirm Delete"
                size="sm"
                onClose={handleCloseConfirmModal}
                open={isConfirmModalOpen}
            >
                <p>Are you sure you want to delete this contact?</p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={handleCloseConfirmModal}>Cancel</Button>
                    <Button danger onClick={handleConfirmDelete}>
                        Confirm
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
