import {FC} from 'react';
import {FieldMeta} from "@tanstack/react-form";

interface Props {
    fieldMeta?: FieldMeta
}

export const FieldInfo: FC<Props> = ({fieldMeta}) => {
    if(!fieldMeta) {
        return null
    }

    return <div>
        {fieldMeta.isTouched && fieldMeta.errors.length ?
            <p className='text-red-700 text-sm/6'>{fieldMeta.errors.join(',')}</p> :
            null
        }

        {fieldMeta.isValidating ? 'Validating...' : null}
    </div>
}