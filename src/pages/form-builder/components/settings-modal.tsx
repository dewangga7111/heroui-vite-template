import { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { Save } from "lucide-react";
import AppTextInput from "@/components/forms/app-text-input";
import AppTextarea from "@/components/forms/app-textarea";
import AppAutocomplete from "@/components/forms/app-autocomplete";
import { actionButtons, button, form } from "@/components/primitives";
import { ElementSettings, FieldType, FormField, COMBO_TIPE_ELEMEN } from "@/types/form-builder";
import { COLS_WITH_AUTO } from "../constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  settings: ElementSettings;
  onSettingsChange: (s: ElementSettings) => void;
  optionType: "static" | "api";
  onOptionTypeChange: (v: "static" | "api") => void;
  availableApiEndpoints: { label: string; value: string }[];
  availableCategories: { label: string; value: string }[];
  availableReferenceFields: { label: string; value: string }[];
  editingElementId: string | null;
  items: FormField[];
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSave,
  settings,
  onSettingsChange,
  optionType,
  onOptionTypeChange,
  availableApiEndpoints,
  availableCategories,
  availableReferenceFields,
  editingElementId,
  items,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof ElementSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
    if (errors[key]) setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!settings.field_key) {
      e.field_key = "Field Key wajib diisi";
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(settings.field_key)) {
      e.field_key = "Harus diawali huruf/underscore, hanya huruf, angka, atau underscore";
    } else if (items.some((i) => i.field_key === settings.field_key && i.field_id !== editingElementId)) {
      e.field_key = "Field Key sudah digunakan";
    }
    if (!settings.label) e.label = "Nama Elemen wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(); };

  const showMinMax = settings.field_type === "NUMBER" || settings.field_type === "CURRENCY";
  const showOptions = settings.field_type === "SELECT" || settings.field_type === "RADIO" || settings.field_type === "CHECKBOX";
  const showPrefixSuffix = settings.field_type !== "RADIO" && settings.field_type !== "LABEL";
  const showPlaceholder = settings.field_type !== "RADIO" && settings.field_type !== "LABEL";

  return (
    <Modal isOpen={isOpen} onOpenChange={(v) => !v && onClose()} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="mx-4">
          <span>Pengaturan Elemen</span>
        </ModalHeader>
        <ModalBody className="py-4">
          <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className={form()}>
              <div className="grid lg:grid-cols-1 gap-4">
                <AppTextInput
                  label="Field Key"
                  placeholder="contoh: nama_lengkap"
                  value={settings.field_key}
                  onValueChange={(v) => set("field_key", v)}
                  isRequired
                  isInvalid={!!errors.field_key}
                  errorMessage={errors.field_key}
                />
                <AppTextInput
                  label="Nama Elemen"
                  placeholder="contoh: Nama Lengkap"
                  value={settings.label}
                  onValueChange={(v) => set("label", v)}
                  isRequired
                  isInvalid={!!errors.label}
                  errorMessage={errors.label}
                />
                <AppAutocomplete
                  label="Tipe Elemen"
                  isRequired
                  selectedKey={settings.field_type}
                  items={[...COMBO_TIPE_ELEMEN]}
                  onSelectionChange={(v) => set("field_type", (v || "TEXT") as FieldType)}
                />
                <AppTextInput
                  label="Deskripsi"
                  placeholder="Deskripsi singkat elemen"
                  value={settings.description}
                  onValueChange={(v) => set("description", v)}
                />
              </div>

              <div className="grid lg:grid-cols-1 gap-4">
                {settings.field_type !== "LABEL" && settings.field_type !== "FILE_UPLOAD" && (
                  <AppTextInput
                    label="Initial Value"
                    value={settings.default_value}
                    onValueChange={(v) => set("default_value", v)}
                  />
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <AppAutocomplete
                  label="Lebar Kolom"
                  selectedKey={settings.cols || "auto"}
                  items={COLS_WITH_AUTO}
                  onSelectionChange={(v) => set("cols", v || "auto")}
                />
                {showPlaceholder && (
                  <AppTextInput
                    label="Placeholder"
                    value={settings.placeholder}
                    onValueChange={(v) => set("placeholder", v)}
                  />
                )}
              </div>

              {showPrefixSuffix && (
                <div className="grid lg:grid-cols-2 gap-4">
                  <AppTextInput
                    label="Prefix"
                    placeholder="contoh: Rp"
                    value={settings.prefix_text}
                    onValueChange={(v) => set("prefix_text", v)}
                  />
                  <AppTextInput
                    label="Suffix"
                    placeholder="contoh: kg"
                    value={settings.suffix_text}
                    onValueChange={(v) => set("suffix_text", v)}
                  />
                </div>
              )}

              {showMinMax && (
                <div className="grid lg:grid-cols-2 gap-4">
                  <AppTextInput
                    type="number"
                    label="Nilai Minimum"
                    value={settings.min_value}
                    onValueChange={(v) => set("min_value", v)}
                  />
                  <AppTextInput
                    type="number"
                    label="Nilai Maksimum"
                    value={settings.max_value}
                    onValueChange={(v) => set("max_value", v)}
                  />
                </div>
              )}

              {settings.field_type === "SELECT" && (
                <div>
                  <p className="text-sm text-foreground mb-2">Tipe Pilihan</p>
                  <RadioGroup
                    orientation="horizontal"
                    value={optionType}
                    onValueChange={(v) => onOptionTypeChange(v as "static" | "api")}
                  >
                    <Radio value="static">Static</Radio>
                    <Radio value="api">API</Radio>
                  </RadioGroup>
                </div>
              )}

              {showOptions && optionType === "static" && (
                <AppTextarea
                  label="Pilihan (pisahkan dengan koma)"
                  placeholder="Laki-laki (L), Perempuan (P)"
                  value={settings.field_options}
                  onValueChange={(v: string) => set("field_options", v)}
                  description="Format: Label (Value) atau hanya Label"
                  minRows={3}
                />
              )}

              {settings.field_type === "SELECT" && optionType === "api" && (
                <div className="grid lg:grid-cols-1 gap-4">
                  <AppAutocomplete
                    label="API Endpoint"
                    placeholder="Pilih endpoint"
                    selectedKey={settings.api_w_option}
                    items={availableApiEndpoints}
                    onSelectionChange={(v) => set("api_w_option", v || "")}
                    description="Endpoint untuk mengambil data pilihan"
                  />
                  {settings.api_w_option === "kluster" && (
                    <AppAutocomplete
                      label="Category"
                      placeholder="Pilih category"
                      selectedKey={settings.category}
                      items={availableCategories}
                      onSelectionChange={(v) => set("category", v || "")}
                      description="Filter kluster berdasarkan category"
                    />
                  )}
                  <AppAutocomplete
                    label="Reference Field (Waterfall)"
                    placeholder="Pilih field referensi (opsional)"
                    selectedKey={settings.field_w_ref}
                    items={availableReferenceFields}
                    onSelectionChange={(v) => set("field_w_ref", v || "")}
                    description="Field yang mempengaruhi pilihan ini"
                  />
                </div>
              )}

              {settings.field_type !== "LABEL" && (
                <Checkbox
                  isSelected={settings.is_required}
                  onValueChange={(v) => set("is_required", v)}
                >
                  Wajib Diisi (Required)
                </Checkbox>
              )}
            </div>
          </Form>
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
