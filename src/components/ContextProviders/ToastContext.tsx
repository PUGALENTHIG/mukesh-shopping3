import React, { createContext, useContext, type ReactNode } from "react";
import { type Theme, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastContextType {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: string | undefined;
}) {
  // Show a success toast
  const showSuccessToast = (message: string) => {
    toast.success(message);
  };

  // Show an error toast
  const showErrorToast = (message: string) => {
    toast.error(message);
  };

  return (
    <ToastContext.Provider value={{ showSuccessToast, showErrorToast }}>
      <ToastContainer
        autoClose={2000}
        hideProgressBar
        theme={theme as Theme}
        position="bottom-right"
      />
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook to access the context
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
