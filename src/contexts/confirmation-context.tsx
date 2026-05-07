import { createContext, useState, ReactNode, useContext } from "react";
import { Modal, Button } from "@heroui/react";

type ConfirmParams = {
  message: string;
  onConfirm: () => void;
  header?: string;
  cancelText?: string;
  confirmText?: string;
};

type ConfirmationContextType = {
  confirm: (params: ConfirmParams) => void;
};

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);
  const [header, setHeader] = useState("Confirmation");
  const [cancelText, setCancelText] = useState("No");
  const [confirmText, setConfirmText] = useState("Yes");

  const confirm = ({
    message,
    onConfirm,
    header = "Confirmation",
    cancelText = "No",
    confirmText = "Yes",
  }: ConfirmParams) => {
    window.dispatchEvent(new Event("close-all-popovers"));
    setMessage(message);
    setOnConfirmAction(() => onConfirm);
    setHeader(header);
    setCancelText(cancelText);
    setConfirmText(confirmText);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onConfirmAction?.();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop isDismissable={false} variant="blur">
          <Modal.Container placement="center">
            <Modal.Dialog>
              <Modal.Header className="justify-center text-center text-lg font-semibold">
                {header}
              </Modal.Header>
              <Modal.Body className="text-center">
                <p className="text-default-600">{message}</p>
              </Modal.Body>
              <Modal.Footer className="flex justify-center gap-4">
                <Button variant="secondary" onPress={handleCancel} fullWidth>
                  {cancelText}
                </Button>
                <Button variant="primary" onPress={handleConfirm} fullWidth>
                  {confirmText}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = (): ConfirmationContextType => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationProvider");
  }
  return context;
};
