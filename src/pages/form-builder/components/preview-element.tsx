import { useState } from "react";
import { RadioGroup, Radio, Checkbox } from "@heroui/react";
import AppTextInput from "@/components/forms/app-text-input";
import AppTextarea from "@/components/forms/app-textarea";
import AppAutocomplete from "@/components/forms/app-autocomplete";
import { ComboOption, FormField } from "@/types/form-builder";
import { parseItems } from "../utils";

interface Props {
  element: FormField;
  fieldApiOptions: Record<string, ComboOption[]>;
  onValueChange: (fieldId: string, value: any) => void;
}

function formatCurrency(val: number | null): string {
  if (val === null || val === undefined) return "";
  return new Intl.NumberFormat("id-ID").format(val);
}

export default function PreviewElement({ element, fieldApiOptions, onValueChange }: Props) {
  const getOptions = (): ComboOption[] => {
    if (element.api_w_option && fieldApiOptions[element.field_id]) {
      return fieldApiOptions[element.field_id];
    }
    if (element.field_options) return parseItems(element.field_options);
    return [];
  };

  switch (element.field_type) {
    case "TEXT":
      return (
        <AppTextInput
          label={element.label}
          placeholder={element.placeholder || ""}
          value={element.value || ""}
          onValueChange={(v) => onValueChange(element.field_id, v)}
          startContent={element.prefix_text ? <span className="text-default-400 text-sm shrink-0">{element.prefix_text}</span> : undefined}
          endContent={element.suffix_text ? <span className="text-default-400 text-sm shrink-0">{element.suffix_text}</span> : undefined}
          isRequired={element.is_required}
        />
      );

    case "NUMBER":
      return (
        <AppTextInput
          type="number"
          label={element.label}
          placeholder={element.placeholder || ""}
          value={element.value || ""}
          onValueChange={(v) => onValueChange(element.field_id, v)}
          min={element.min_value || undefined}
          max={element.max_value || undefined}
          startContent={element.prefix_text ? <span className="text-default-400 text-sm shrink-0">{element.prefix_text}</span> : undefined}
          endContent={element.suffix_text ? <span className="text-default-400 text-sm shrink-0">{element.suffix_text}</span> : undefined}
          isRequired={element.is_required}
        />
      );

    case "CURRENCY": {
      const [displayVal, setDisplayVal] = useState(formatCurrency(element.value));
      return (
        <AppTextInput
          label={element.label}
          placeholder={element.placeholder || ""}
          value={displayVal}
          startContent={element.prefix_text ? <span className="text-default-400 text-sm shrink-0">{element.prefix_text}</span> : undefined}
          endContent={element.suffix_text ? <span className="text-default-400 text-sm shrink-0">{element.suffix_text}</span> : undefined}
          isRequired={element.is_required}
          onChange={(e) => {
            const raw = e.target.value.replace(/\./g, "").replace(/[^\d]/g, "");
            const num = raw === "" ? null : parseInt(raw, 10);
            onValueChange(element.field_id, num);
            setDisplayVal(num !== null ? formatCurrency(num) : "");
          }}
          onBlur={() => setDisplayVal(formatCurrency(element.value))}
        />
      );
    }

    case "TEXTAREA":
      return (
        <AppTextarea
          label={element.label}
          placeholder={element.placeholder || ""}
          value={element.value || ""}
          onValueChange={(v: string) => onValueChange(element.field_id, v)}
          minRows={3}
          isRequired={element.is_required}
        />
      );

    case "LABEL":
      return (
        <div className="flex items-end h-full pt-6">
          <label className="text-sm font-medium">{element.label}</label>
        </div>
      );

    case "SELECT": {
      const opts = getOptions();
      return (
        <AppAutocomplete
          label={element.label}
          placeholder={element.placeholder || "Pilih..."}
          selectedKey={element.value || ""}
          items={opts}
          itemLabel="title"
          itemValue="value"
          onSelectionChange={(v) => onValueChange(element.field_id, v || "")}
          isRequired={element.is_required}
        />
      );
    }

    case "RADIO": {
      const opts = getOptions();
      return (
        <RadioGroup
          label={element.label}
          orientation="horizontal"
          value={element.value || ""}
          onValueChange={(v) => onValueChange(element.field_id, v)}
          isRequired={element.is_required}
          classNames={{ label: "text-sm text-foreground" }}
        >
          {opts.map((opt) => (
            <Radio key={opt.value} value={opt.value}>{opt.title}</Radio>
          ))}
        </RadioGroup>
      );
    }

    case "CHECKBOX": {
      const opts = getOptions();
      const checkboxVal = element.value || {};
      return (
        <div>
          {element.label && (
            <label className="text-sm text-foreground block mb-2">{element.label}</label>
          )}
          <div className="flex flex-wrap gap-3">
            {opts.map((opt) => (
              <Checkbox
                key={opt.value}
                isSelected={!!checkboxVal[opt.value]}
                onValueChange={(checked) =>
                  onValueChange(element.field_id, { ...checkboxVal, [opt.value]: checked })
                }
              >
                {opt.title}
              </Checkbox>
            ))}
          </div>
        </div>
      );
    }

    case "FILE_UPLOAD":
      return (
        <div>
          {element.label && (
            <label className="text-sm text-foreground block mb-1">
              {element.label}{element.is_required && " *"}
            </label>
          )}
          <input
            type="file"
            className="w-full text-sm border border-default-300 rounded-xl px-3 py-2 text-default-600 bg-default-100"
            onChange={(e) => onValueChange(element.field_id, e.target.files?.[0] || null)}
          />
        </div>
      );

    default:
      return (
        <AppTextInput
          label={element.label}
          value={element.value || ""}
          onValueChange={(v) => onValueChange(element.field_id, v)}
          isRequired={element.is_required}
        />
      );
  }
}
