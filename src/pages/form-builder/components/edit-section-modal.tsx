import { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Save, X } from "lucide-react";
import AppTextInput from "@/components/forms/app-text-input";
import { actionButtons, button, form } from "@/components/primitives";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  label: string;
  onLabelChange: (v: string) => void;
  isRepeatable: boolean;
  onRepeatableChange: (v: boolean) => void;
}

export default function EditSectionModal({
  isOpen,
  onClose,
  onSave,
  label,
  onLabelChange,
  isRepeatable,
  onRepeatableChange,
}: Props) {
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!label.trim()) { setError("Nama Section wajib diisi"); return; }
    setError("");
    onSave();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(v) => !v && onClose()} size="sm">
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <span>Edit Section</span>
          <Button isIconOnly size="sm" variant="light" onPress={onClose}><X size={16} /></Button>
        </ModalHeader>
        <Divider />
        <ModalBody className="py-4">
          <div className={form()}>
            <AppTextInput
              label="Nama Section"
              isRequired
              value={label}
              onValueChange={(v) => { onLabelChange(v); setError(""); }}
              isInvalid={!!error}
              errorMessage={error}
            />
            <Checkbox isSelected={isRepeatable} onValueChange={onRepeatableChange}>
              Repetitive
            </Checkbox>
          </div>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <div className={actionButtons()}>
            <Button color="primary" variant="flat" className={button()} onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" className={button()} startContent={<Save size={15} />} onPress={handleSave}>
              Simpan
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
