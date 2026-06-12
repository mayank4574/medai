import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setModalConfig(null);
    setIsLoading(false);
  };

  const openConfirm = (config) => {
    setModalConfig({
      type: 'confirm',
      ...config,
    });
  };

  const openSuccess = (config) => {
    setModalConfig({
      type: 'success',
      ...config,
    });
  };

  const openError = (config) => {
    setModalConfig({
      type: 'error',
      ...config,
    });
  };

  const handleConfirm = async () => {
    if (!modalConfig || !modalConfig.onConfirm) {
      closeModal();
      return;
    }
    setIsLoading(true);
    try {
      const result = await modalConfig.onConfirm();
      // If the confirm handler returned a new modal config (like a success modal)
      if (result && typeof result === 'object') {
        setModalConfig({
          type: result.type || 'success',
          ...result,
        });
        setIsLoading(false);
      } else {
        closeModal();
      }
    } catch (err) {
      console.error("Modal confirmation failed:", err);
      setModalConfig({
        type: 'error',
        title: 'Operation Failed',
        description: err.response?.data?.message || err.message || 'An error occurred during this action.',
        lang: modalConfig?.lang,
      });
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    if (modalConfig && modalConfig.onClose) {
      setIsLoading(true);
      try {
        await modalConfig.onClose();
      } catch (err) {
        console.error("Modal close handler failed:", err);
      }
    }
    closeModal();
  };

  return (
    <ModalContext.Provider value={{ openConfirm, openSuccess, openError, closeModal }}>
      {children}
      <ConfirmModal
        isOpen={!!modalConfig}
        type={modalConfig?.type}
        title={modalConfig?.title}
        description={modalConfig?.description}
        variant={modalConfig?.variant}
        confirmText={modalConfig?.confirmText}
        cancelText={modalConfig?.cancelText}
        onConfirm={handleConfirm}
        onClose={handleClose}
        isLoading={isLoading}
        lang={modalConfig?.lang}
        contextKey={modalConfig?.contextKey}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
