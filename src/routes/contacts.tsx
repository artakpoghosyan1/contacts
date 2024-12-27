import {createFileRoute, Link, Outlet} from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'
import {getContacts} from '../services/api.ts'

export const Route = createFileRoute('/contacts')({
    component: Index,
})

function Index() {
    const {
        data: contacts,
        isLoading,
        error,
    } = useQuery({queryKey: ['contacts'], queryFn: getContacts})

    if (isLoading) {
        return <span>... loading</span>
    }

    if (error) {
        return <span>{error.message}</span>
    }

    return (
        <div>
            <div className="p-2">
                {contacts?.map((contact) => (
                    <Link key={contact.id} to={contact.id}>
                        {contact.name}
                    </Link>
                ))}

                <Outlet/>
            </div>
        </div>
    )
}
