'use client';

import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDismissible?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  isDismissible = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isDismissible) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current && isDismissible) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isDismissible) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className="backdrop:bg-background/80 backdrop:backdrop-blur-sm glass-card rounded-2xl shadow-2xl max-w-lg w-full p-0 overflow-hidden outline-none focus:outline-none"
    >
      <div className="bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-foreground/5 bg-foreground/5">
          <h2 className="text-xl font-heading font-bold text-foreground leading-tight">{title}</h2>
          {isDismissible && (
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-foreground/10 transition-all duration-300 text-foreground/40 hover:text-foreground group focus:outline-none focus:ring-2 focus:ring-secondary/50"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 text-foreground/90 leading-relaxed font-body">
          {children}
        </div>
      </div>
    </dialog>
  );
}
