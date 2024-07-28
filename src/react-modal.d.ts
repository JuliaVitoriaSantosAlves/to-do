declare module 'react-modal' {
    import * as React from 'react';

    interface ModalProps {
        isOpen: boolean;
        onRequestClose?: () => void;
        contentLabel?: string;
        style?: React.CSSProperties;
        className?: string;
        overlayClassName?: string;
        bodyOpenClassName?: string;
        htmlOpenClassName?: string;
        ariaHideApp?: boolean;
        shouldFocusAfterRender?: boolean;
        shouldCloseOnOverlayClick?: boolean;
        shouldCloseOnEsc?: boolean;
        onAfterOpen?: () => void;
        onAfterClose?: () => void;
        aria?: { [key: string]: string };
        role?: string;
        parentSelector?: () => HTMLElement;
        portalClassName?: string;
        overlayRef?: React.Ref<HTMLDivElement>;
        contentRef?: React.Ref<HTMLDivElement>;
        appElement?: HTMLElement;
        testId?: string;
    }

    const Modal: React.ComponentType<ModalProps>;

    export default Modal;
}