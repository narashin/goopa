import React from 'react';

import {
    toast, ToastContent, ToastContentProps, ToastOptions,
} from 'react-toastify';

interface StyledToastProps extends Omit<ToastOptions, 'bodyClassName'> {
    message: ToastContent;
}

export const StyledToast: React.FC<StyledToastProps> = ({
    message,
    ...options
}) => {
    return toast(
        (props: ToastContentProps<unknown>) => (
            <div className="styled-toast-body">
                {typeof message === 'function' ? message(props) : message}
            </div>
        ),
        {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'styled-toast',
            ...options,
        }
    );
};

export const successToast = (
    message: ToastContent,
    options?: Omit<ToastOptions, 'bodyClassName'>
) => {
    return StyledToast({ message, type: 'success', ...options });
};

export const errorToast = (
    message: ToastContent,
    options?: Omit<ToastOptions, 'bodyClassName'>
) => {
    return StyledToast({ message, type: 'error', ...options });
};
