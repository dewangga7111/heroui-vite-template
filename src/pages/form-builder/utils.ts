import { ComboOption, FieldType, FormField } from "@/types/form-builder";

export function getElementsForSection(items: FormField[], sectionFieldId: string): FormField[] {
  return items.filter(
    (item) => item.parent_field_id === sectionFieldId && item.field_type !== "SECTION"
  );
}

export function getDuplicatesForSection(items: FormField[], sectionFieldId: string): FormField[] {
  return items.filter(
    (item) => item.parent_field_id === sectionFieldId && item.field_type === "SECTION"
  );
}

export function parseItems(optionsStr: string): ComboOption[] {
  if (!optionsStr) return [];
  return optionsStr.split(",").map((item) => {
    const trimmed = item.trim();
    const match = trimmed.match(/^(.+?)\s*\((.+?)\)\s*$/);
    if (match) return { title: match[1].trim(), value: match[2].trim() };
    return { title: trimmed, value: trimmed };
  });
}

export function getDuplicateFieldKeys(items: FormField[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const item of items) {
    if (!item.field_key) continue;
    if (seen.has(item.field_key)) duplicates.add(item.field_key);
    else seen.add(item.field_key);
  }
  return Array.from(duplicates);
}

export function getInitialValue(fieldType: FieldType, defaultValue: string | null): any {
  if (fieldType === "CHECKBOX") return {};
  if (fieldType === "FILE_UPLOAD") return null;
  if (fieldType === "CURRENCY") return defaultValue ? Number(defaultValue) : null;
  return defaultValue || "";
}
