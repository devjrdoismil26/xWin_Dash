import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const DialogContext = createContext(null);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within <Dialog>');
  return ctx;
};

export const Dialog = ({ open: openProp, defaultOpen = false, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = (value) => {
    if (openProp === undefined) setInternalOpen(value);
    onOpenChange?.(value);
  };

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};

Dialog.propTypes = {
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  children: PropTypes.node,
};

export const DialogTrigger = ({ asChild = false, children }) => {
  const { setOpen } = useDialog();
  const child = React.Children.only(children);
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child, {
      onClick: (e) => {
        child.props.onClick?.(e);
        setOpen(true);
      },
    });
  }
  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
};

DialogTrigger.propTypes = { asChild: PropTypes.bool, children: PropTypes.node };

export const DialogClose = ({ asChild = false, children }) => {
  const { setOpen } = useDialog();
  const child = React.Children.only(children);
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child, {
      onClick: (e) => {
        child.props.onClick?.(e);
        setOpen(false);
      },
    });
  }
  return (
    <button type="button" onClick={() => setOpen(false)}>
      {children}
    </button>
  );
};

DialogClose.propTypes = { asChild: PropTypes.bool, children: PropTypes.node };

export const DialogPortal = ({ children }) => {
  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(children, document.body);
};

DialogPortal.propTypes = { children: PropTypes.node };

export const DialogOverlay = ({ className = '' }) => {
  const { open, setOpen } = useDialog();
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm ${className}`}
      onClick={() => setOpen(false)}
      aria-hidden="true"
    />
  );
};

DialogOverlay.propTypes = { className: PropTypes.string };

export const DialogContent = ({ className = '', children }) => {
  const { open, setOpen } = useDialog();
  if (!open) return null;
  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg ${className}`}
      >
        {children}
        <button
          type="button"
          className="absolute right-4 top-4 rounded-sm opacity-80 hover:opacity-100 focus:outline-none"
          onClick={() => setOpen(false)}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </DialogPortal>
  );
};

DialogContent.propTypes = { className: PropTypes.string, children: PropTypes.node };

export const DialogHeader = ({ className = '', children }) => (
  <div className={`mb-2 flex flex-col space-y-1.5 text-left ${className}`}>{children}</div>
);
export const DialogFooter = ({ className = '', children }) => (
  <div className={`mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>{children}</div>
);
export const DialogTitle = ({ className = '', children }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>
);
export const DialogDescription = ({ className = '', children }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

DialogHeader.propTypes = { className: PropTypes.string, children: PropTypes.node };
DialogFooter.propTypes = { className: PropTypes.string, children: PropTypes.node };
DialogTitle.propTypes = { className: PropTypes.string, children: PropTypes.node };
DialogDescription.propTypes = { className: PropTypes.string, children: PropTypes.node };
