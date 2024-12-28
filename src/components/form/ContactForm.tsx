import {z} from 'zod';
import {useForm} from '@tanstack/react-form'
import {Contact} from "../../interfaces/contact.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addContact, updateContact} from "../../services/api.ts";
import {ChangeEvent, FC, useMemo} from "react";
import {FileUpload} from "./FileUpload.tsx";
import {Field} from "./Field.tsx";
import {Button} from "../Button.tsx";
import {useNavigate} from "@tanstack/react-router";
import { nanoid } from 'nanoid'
import {saveImage} from "../../services/indexedDB.ts";

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    lastname: z.string().min(1, 'Last Name is required'),
    description: z.string().optional(),
    avatar: z.string().nonempty('Avatar is required')
});

interface Props {
    initialData?: Contact;
    onClose: () => void
}

export const ContactForm: FC<Props> = ({initialData, onClose}) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const id = useMemo(() => initialData?.id ?? nanoid(), [initialData])

    const {mutate, isPending} = useMutation({
        mutationFn: initialData ? updateContact : addContact,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['contacts']})
            if(!initialData) {
                navigate({ to: `/contacts/${data.id}` })
            }
        },
        onError: (error) => {
            console.error('Error creating contact:', error)
        },
    });

    const defaultValues: Omit<Contact, 'id'> = {
        name: initialData?.name || '',
        lastname: initialData?.lastname || '',
        description: initialData?.description || '',
        avatar: initialData?.avatar || '',
    }

    const form = useForm({
        defaultValues,
        validators: {
            onChange: contactSchema
        },
        onSubmit: async (data) => {
            mutate({...data.value, id}, {onSuccess: onClose})
        },
    });

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        const url = file ? await saveImage(id, file) : ''
        form.setFieldValue('avatar', url)
        form.validateField('avatar', 'change')
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
        >
            <div className='mb-7'>
                <FileUpload form={form} onChange={handleFileChange}/>
            </div>

            <div className='grid gap-4 lg:grid-cols-2 mb-7'>
                <div>
                    <Field
                        form={form}
                        name="name"
                        label='First name'
                        required
                    />
                </div>

                <div>
                    <Field
                        form={form}
                        name="lastname"
                        label='Last name'
                        required
                    />
                </div>
            </div>

            <div>
                <Field
                    form={form}
                    name="description"
                    label='Description'
                    textarea
                />
            </div>

            <div className="px-4 py-3 sm:flex gap-3 sm:flex-row-reverse sm:px-6 mt-3">
                <form.Subscribe
                    selector={(state) => [state.isSubmitting]}
                    children={([isSubmitting]) => (
                        <Button type="submit" primary>
                            {isSubmitting || isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                    )}
                />

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}