import { ElementSettings } from "@/types/form-builder";
import { COLS_OPTIONS } from "@/types/form-builder";

export const COLS_WITH_AUTO = [
  { label: "Auto (col-6)", value: "auto" },
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
  "1":  "col-span-12 md:col-span-1",
  "2":  "col-span-12 md:col-span-2",
  "3":  "col-span-12 md:col-span-3",
  "4":  "col-span-12 md:col-span-4",
  "5":  "col-span-12 md:col-span-5",
  "6":  "col-span-12 md:col-span-6",
  "7":  "col-span-12 md:col-span-7",
  "8":  "col-span-12 md:col-span-8",
  "9":  "col-span-12 md:col-span-9",
  "10": "col-span-12 md:col-span-10",
  "11": "col-span-12 md:col-span-11",
  "12": "col-span-12",
  auto: "col-span-12 md:col-span-6",
};
