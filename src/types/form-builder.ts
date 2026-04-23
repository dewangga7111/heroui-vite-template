export type FieldType =
  | "CHECKBOX"
  | "FILE_UPLOAD"
  | "NUMBER"
  | "TEXT"
  | "LABEL"
  | "RADIO"
  | "SELECT"
  | "TEXTAREA"
  | "CURRENCY"
  | "SECTION";

export interface FormField {
  field_id: string;
  parent_field_id: string | null;
  field_key: string;
  label: string;
  field_type: FieldType;
  is_repeatable: boolean;
  default_value: string | null;
  prefix_text: string | null;
  suffix_text: string | null;
  min_value: string | null;
  max_value: string | null;
  field_options: string | null;
  api_w_option: string | null;
  field_w_ref: string | null;
  category: string | null;
  sort_order: number;
  is_required: boolean;
  is_active: boolean;
  description: string | null;
  is_auto_suggest: boolean;
  // Frontend-only
  value: any;
  cols: string;
  placeholder: string;
}

export interface ElementSettings {
  label: string;
  field_type: FieldType;
  field_key: string;
  default_value: string;
  prefix_text: string;
  suffix_text: string;
  cols: string;
  placeholder: string;
  field_options: string;
  min_value: string;
  max_value: string;
  is_required: boolean;
  api_w_option: string;
  field_w_ref: string;
  category: string;
  description: string;
  is_active: boolean;
  is_auto_suggest: boolean;
}

export interface ComboOption {
  title: string;
  value: string;
}

export const FIELD_TYPE_LABELS: Record<string, string> = {
  CHECKBOX: "Checkbox",
  FILE_UPLOAD: "File Upload",
  NUMBER: "Input Number",
  TEXT: "Input Text",
  LABEL: "Label",
  RADIO: "Radio Button",
  SELECT: "Select Box",
  TEXTAREA: "Text Area",
  CURRENCY: "Currency",
};

export const COMBO_TIPE_ELEMEN = [
  { label: "Checkbox", value: "CHECKBOX" },
  { label: "File Upload", value: "FILE_UPLOAD" },
  { label: "Input Number", value: "NUMBER" },
  { label: "Input Text", value: "TEXT" },
  { label: "Label", value: "LABEL" },
  { label: "Radio Button", value: "RADIO" },
  { label: "Select Box", value: "SELECT" },
  { label: "Text Area", value: "TEXTAREA" },
  { label: "Currency", value: "CURRENCY" },
] as const;

export const COLS_OPTIONS = [
  { label: "col-1  (1/12)", value: "1" },
  { label: "col-2  (1/6)",  value: "2" },
  { label: "col-3  (1/4)",  value: "3" },
  { label: "col-4  (1/3)",  value: "4" },
  { label: "col-5  (5/12)", value: "5" },
  { label: "col-6  (1/2)",  value: "6" },
  { label: "col-7  (7/12)", value: "7" },
  { label: "col-8  (2/3)",  value: "8" },
  { label: "col-9  (3/4)",  value: "9" },
  { label: "col-10 (5/6)",  value: "10" },
  { label: "col-11 (11/12)", value: "11" },
  { label: "col-12 (Full)", value: "12" },
] as const;
