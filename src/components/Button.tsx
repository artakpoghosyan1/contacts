import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    danger?: boolean;
    children: ReactNode;
}

export const Button: FC<Props> = ({ onClick, children, primary, danger, className = '', ...rest }) => {
    return (
        <button
            {...rest}
            className={`${
                danger
                    ? 'text-red-600 hover:text-red-500 focus-visible:outline-red-600'
                    : primary
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                        : 'bg-white text-gray-900 hover:bg-gray-50'
            } ${className} justify-center rounded-md px-3 py-2 text-sm font-semibold ring-1 shadow-xs ring-gray-300 ring-inset sm:mt-0 sm:w-auto`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
