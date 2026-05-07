
import React, { useState } from "react";
import { Card, Button, Form } from "@heroui/react";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FilterField } from "@/types/filter";
import AppDatePicker from "@/components/forms/app-date-picker";
import AppDateRangePicker from "@/components/forms/app-date-range-picker";
import AppAutocomplete from "@/components/forms/app-autocomplete";
import AppTextInput from "@/components/forms/app-text-input";
import { actionButtons, button } from "@/components/primitives";

interface DynamicFilterProps {
  fields: FilterField[];
  onFilter: (data: Record<string, any>) => void;
  onClear: () => void;
}

export default function DynamicFilter({
  fields,
  onFilter,
  onClear,
}: DynamicFilterProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedValues: Record<string, any> = {};
    Object.entries(formValues).forEach(([key, value]) => {
      if (!value) return;
      formattedValues[key] = value;
    });

    onFilter(formattedValues);
  };

  const handleClear = () => {
    const clearedValues: Record<string, any> = {};
    fields.forEach((f) => {
      clearedValues[f.key] = null;
    });
    setFormValues(clearedValues);
    onClear();
  };

  return (
    <Card className="mb-3 overflow-hidden">
      <Card.Header
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold text-md">Filter</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </Card.Header>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Card.Content>
              <Form id="filterForm" onSubmit={handleSubmit}>
                <div className="w-full flex flex-col gap-4">
                  <div className={`grid sm:grid-cols-3 gap-4`}>
                    {fields.map((field) => {
                      const value = formValues[field.key];

                      switch (field.type) {
                        case "input":
                          return (
                            <AppTextInput
                              key={field.key}
                              label={field.label}
                              placeholder={field.placeholder}
                              value={value || ""}
                              onChange={(val) => handleChange(field.key, val)}
                            />
                          );

                        case "autocomplete":
                          return (
                            <AppAutocomplete
                              key={field.key}
                              label={field.label}
                              placeholder={field.placeholder}
                              selectedKey={value || ""}
                              items={field.options ?? []}
                              onSelectionChange={(v: any) => handleChange(field.key, v)}
                            />
                          );

                        case "datepicker":
                          return (
                            <AppDatePicker
                              key={field.key}
                              label={field.label}
                              value={value ?? null}
                              onChange={(v: any) => handleChange(field.key, v)}
                            />
                          );

                        case "daterange":
                          return (
                            <AppDateRangePicker
                              key={field.key}
                              label={field.label}
                              value={value ?? null}
                              onChange={(v) => handleChange(field.key, v)}
                            />
                          );

                        default:
                          return null;
                      }
                    })}
                  </div>

                  <div className={actionButtons()}>
                    <Button
                      type="button"
                      variant="secondary"
                      className={button()}
                      onPress={handleClear}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className={button()}
                    >
                      <Search size={15} />
                      Search
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Content>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
