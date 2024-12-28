import {ChangeEvent, FC} from 'react';
import {FieldInfo} from "./FieldInfo.tsx";
import {ReactFormExtendedApi} from "@tanstack/react-form";
import {Contact} from "../../interfaces/contact.ts";

interface Props {
    form: ReactFormExtendedApi<Omit<Contact, 'id'>>
    name: keyof Omit<Contact, 'id'>
    label: string
    textarea?: boolean
    required?: boolean
}

export const Field: FC<Props> = ({form, name, label, textarea, required}) => {
    return <form.Field
        name={name}
        children={(field) => {
            const fieldAttributes = {
                id: field.name,
                name: field.name,
                value: field.state.value,
                onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => field.handleChange(e.target.value),
                className: "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            }

            return (
                <>
                    <label
                        htmlFor={field.name}
                        className={`block font-medium text-gray-900 mb-2 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}
                    >
                        {label}
                    </label>

                    {textarea ?
                        <textarea {...fieldAttributes}/> :
                        <input {...fieldAttributes}/>
                    }

                    <FieldInfo fieldMeta={field.state.meta}/>
                </>
            );
        }}
    />
}