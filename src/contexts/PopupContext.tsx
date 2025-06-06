import { createContext, ReactNode, useContext, useState } from "react";

interface PopupContextType {
  visible: boolean;
  setVisible: (state: boolean) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <PopupContext.Provider value={{ visible, setVisible }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error(
      "usePopupContext must be used within a PopupContextProvider"
    );
  }
  return context;
};
