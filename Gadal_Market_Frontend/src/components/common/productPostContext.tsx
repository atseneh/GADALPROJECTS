import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface FormDataContextType {
  formData: FormData | null;
  setFormData: (formData: FormData | null) => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);
const FormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

const useFormData = (): FormDataContextType => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormProvider');
  }
  return context;
};

export { FormProvider, useFormData };
