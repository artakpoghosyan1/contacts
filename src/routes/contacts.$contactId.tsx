import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import {getContactById} from "../services/api.ts";
import {Contact} from "../interfaces/contact.ts";

export const Route = createFileRoute('/contacts/$contactId')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { contactId } }) => {
    return queryClient.ensureQueryData({
      queryKey: ['contact', contactId],
      queryFn: () => getContactById(contactId),
    })
  },
})

function RouteComponent() {
  const contact: Contact = useLoaderData({ from: '/contacts/$contactId' })
  return <div>
    <div>
      <img src={contact.avatar} alt={contact.name}/>
    </div>

    <div>
      {contact.name} {contact.lastName}
    </div>

    <div>
      {contact.description}
    </div>

    <div>
      <button>Edit</button>

      <button>Delete</button>
    </div>
  </div>
}
