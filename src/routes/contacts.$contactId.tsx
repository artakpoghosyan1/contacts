import { createFileRoute } from '@tanstack/react-router'
import {getContactById} from "../services/api.ts";
import {useCallback, useState} from "react";
import {ContactForm} from "../components/form/ContactForm.tsx";
import {Modal} from "../components/Modal.tsx";
import {useQuery} from "@tanstack/react-query";

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

  if(isLoading) {
    return <span>... loading</span>
  }

  if(error) {
    return <span>{error.message}</span>
  }

  return <div>
    <div>
      <img src={contact.avatar} alt={contact.name}/>
    </div>

    <div>
      {contact.name} {contact.lastname}
    </div>

    <div>
      {contact.description}
    </div>

    <div>
      <button onClick={() => setIsOpenModal(true)}>Edit</button>

      <button>Delete</button>

      <Modal
          title='Edit contact'
          size='lg'
          onClose={handleCloseModal}
          open={isOpenModal}
      >
        <ContactForm onClose={handleCloseModal} initialData={contact} />
      </Modal>
    </div>
  </div>
}
