import { ElementSettings } from "@/types/form-builder";
import { COLS_OPTIONS } from "@/types/form-builder";

export const COLS_WITH_AUTO = [
  { label: "Auto (1/2)", value: "auto" },
  ...COLS_OPTIONS,
];

export const DEFAULT_SETTINGS: ElementSettings = {
  label: "",
  field_type: "TEXT",
  field_key: "",
  default_value: "",
  prefix_text: "",
  suffix_text: "",
  cols: "auto",
  placeholder: "",
  field_options: "",
  min_value: "",
  max_value: "",
  is_required: false,
  api_w_option: "",
  field_w_ref: "",
  category: "",
  description: "",
  is_active: true,
  is_auto_suggest: false,
};

export const colsClass: Record<string, string> = {
  "12": "col-span-12",
  "6": "col-span-12 md:col-span-6",
  "4": "col-span-12 md:col-span-4",
  "3": "col-span-12 md:col-span-3",
  auto: "col-span-12 md:col-span-6",
};
