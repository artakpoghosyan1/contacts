import {ChangeEvent, FC, memo} from 'react';
import {FieldInfo} from "./FieldInfo.tsx";
import {ReactFormExtendedApi} from "@tanstack/react-form";
import {Contact} from "../../interfaces/contact.ts";

interface Props {
    form: ReactFormExtendedApi<Omit<Contact, 'id'>>
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const FileUpload: FC<Props> = memo(({form, onChange}) => {
    return <form.Field
        name="avatar"
        children={(field) => {
            return (
                <>
                    <label htmlFor={field.name} className='inline-block'>
                        <span className='block font-medium text-gray-900 mb-2 after:content-["*"] after:ml-0.5 after:text-red-500'>
                            Avatar
                        </span>

                        <div className='cursor-pointer'>
                            <div
                                className='text-sm border border-dashed border-gray-500 w-24 h-24 flex flex-col items-center rounded-2xl justify-center gap-3 overflow-hidden'>
                                {field.state.value ?
                                    <img
                                        src={field.state.value} alt="Avatar Preview"
                                        className="object-cover w-full h-full"
                                    /> :
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                             viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M12 4.5v15m7.5-7.5h-15"/>
                                        </svg>

                                        Upload
                                    </>
                                }
                            </div>
                        </div>
                    </label>

                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        id={field.name}
                        name={field.name}
                        onChange={onChange}
                        className="sr-only"
                    />

                    <FieldInfo fieldMeta={field.state.meta}/>
                </>
            );
        }}
    />
})