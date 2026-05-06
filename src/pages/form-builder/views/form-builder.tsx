import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
} from "@heroui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Copy, FileQuestion, Plus, Save, Trash2 } from "lucide-react";

import { useConfirmation } from "@/contexts/confirmation-context";
import { showSuccessToast, showErrorToast } from "@/utils/common";
import AppTextInput from "@/components/forms/app-text-input";
import { actionButtons, button, form } from "@/components/primitives";
import { ComboOption, ElementSettings, FormField } from "@/types/form-builder";

import { DEFAULT_SETTINGS, colsClass } from "../constants";
import {
  getElementsForSection,
  getDuplicatesForSection,
  getDuplicateFieldKeys,
  getInitialValue,
} from "../utils";
import SectionPanel from "../components/section-panel";
import PreviewElement from "../components/preview-element";
import SettingsModal from "../components/settings-modal";
import EditSectionModal from "../components/edit-section-modal";

export default function FormBuilderPage() {
  const navigate = useNavigate();
  useParams<{ id: string }>();
  const { confirm } = useConfirmation();

  const [items, setItems] = useState<FormField[]>([]);
  const [fieldApiOptions, setFieldApiOptions] = useState<Record<string, ComboOption[]>>({});
  const [isDeleteForm] = useState(false);

  // Sidebar temp state
  const [sectionName, setSectionName] = useState("");
  const [sectionNameError, setSectionNameError] = useState("");
  const [isRepeatable, setIsRepeatable] = useState(false);
  const [elementNames, setElementNames] = useState<Record<string, string>>({});

  // Settings modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [elementSettings, setElementSettings] = useState<ElementSettings>({ ...DEFAULT_SETTINGS });
  const [optionType, setOptionType] = useState<"static" | "api">("static");

  // Edit section modal state
  const [editSectionOpen, setEditSectionOpen] = useState(false);
  const [editingSectionData, setEditingSectionData] = useState<FormField | null>(null);
  const [editSectionLabel, setEditSectionLabel] = useState("");
  const [editSectionRepeatable, setEditSectionRepeatable] = useState(false);

  const availableApiEndpoints = [
    { label: "Kluster", value: "kluster" },
    { label: "Sub Kluster", value: "subkluster" },
  ];
  const [availableCategories] = useState<{ label: string; value: string }[]>([]);

  const sectionSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sidebarSections = useMemo(
    () => items.filter((i) => i.field_type === "SECTION" && i.parent_field_id === null),
    [items]
  );

  const allSections = useMemo(
    () => items.filter((i) => i.field_type === "SECTION"),
    [items]
  );

  const availableReferenceFields = useMemo(() => {
    if (!editingSectionId) return [];
    return getElementsForSection(items, editingSectionId)
      .filter((el) => el.field_type === "SELECT" || el.field_type === "RADIO")
      .map((el) => ({ label: el.label || el.field_key, value: el.field_key }));
  }, [items, editingSectionId]);

  // Waterfall: watch item values and cascade-clear dependent fields
  const prevItemValues = useRef<Record<string, any>>({});

  useEffect(() => {
    const waterfallItems = items.filter((i) => i.field_w_ref && i.api_w_option);
    if (waterfallItems.length === 0) return;

    waterfallItems.forEach((item) => {
      const refField = items.find((f) => f.field_key === item.field_w_ref);
      if (!refField) return;
      const prevVal = prevItemValues.current[refField.field_id];
      const currVal = refField.value;
      if (prevVal !== currVal) {
        if (currVal) fetchFieldOptions(item);
        else {
          setFieldApiOptions((prev) => ({ ...prev, [item.field_id]: [] }));
          updateItemValue(item.field_id, "");
        }
      }
    });

    const newPrev: Record<string, any> = {};
    items.forEach((i) => { newPrev[i.field_id] = i.value; });
    prevItemValues.current = newPrev;
  }, [items]);

  const updateItemValue = useCallback((fieldId: string, value: any) => {
    setItems((prev) => prev.map((item) => item.field_id === fieldId ? { ...item, value } : item));
  }, []);

  const fetchFieldOptions = useCallback(async (element: FormField) => {
    if (!element.api_w_option) return;
    // stub — replace with real API call
    setFieldApiOptions((prev) => ({ ...prev, [element.field_id]: [] }));
  }, []);

  // ── Add Section ───────────────────────────────────────────────────────────────
  const addSection = () => {
    if (!sectionName.trim()) { setSectionNameError("Nama Section wajib diisi"); return; }
    setSectionNameError("");
    const sectionFieldId = uuidv4();
    setItems((prev) => [
      ...prev,
      {
        field_id: sectionFieldId,
        parent_field_id: null,
        field_key: sectionName.toLowerCase().replace(/\s+/g, "_"),
        label: sectionName,
        field_type: "SECTION",
        is_repeatable: isRepeatable,
        default_value: null, prefix_text: null, suffix_text: null,
        min_value: null, max_value: null, field_options: null,
        api_w_option: null, field_w_ref: null, category: null,
        sort_order: sidebarSections.length + 1,
        is_required: false, is_active: true, description: null, is_auto_suggest: false,
        value: "", cols: "auto", placeholder: "",
      },
    ]);
    setSectionName("");
    setIsRepeatable(false);
  };

  // ── Add Element ───────────────────────────────────────────────────────────────
  const addElement = (sectionFieldId: string) => {
    const elementName = elementNames[sectionFieldId] || "";
    if (!elementName.trim()) { showErrorToast("Nama Element wajib diisi"); return; }

    const existingElements = getElementsForSection(items, sectionFieldId);
    const newElement: FormField = {
      field_id: uuidv4(),
      parent_field_id: sectionFieldId,
      field_key: "", label: elementName, field_type: "TEXT",
      is_repeatable: false, default_value: null, prefix_text: null,
      suffix_text: null, min_value: null, max_value: null,
      field_options: null, api_w_option: null, field_w_ref: null, category: null,
      sort_order: existingElements.length + 1,
      is_required: false, is_active: true, description: null, is_auto_suggest: false,
      value: "", cols: "auto", placeholder: "",
    };

    let insertIndex = items.findIndex((s) => s.field_id === sectionFieldId) + 1;
    for (let i = insertIndex; i < items.length; i++) {
      if (items[i].parent_field_id === sectionFieldId && items[i].field_type !== "SECTION") insertIndex = i + 1;
      else if (items[i].parent_field_id !== sectionFieldId) break;
    }

    const newItems = [...items];
    newItems.splice(insertIndex, 0, newElement);

    getDuplicatesForSection(newItems, sectionFieldId).forEach((dup) => {
      const dupEl: FormField = {
        ...JSON.parse(JSON.stringify(newElement)),
        field_id: uuidv4(),
        parent_field_id: dup.field_id,
        sort_order: getElementsForSection(newItems, dup.field_id).length + 1,
      };
      let di = newItems.findIndex((s) => s.field_id === dup.field_id) + 1;
      for (let i = di; i < newItems.length; i++) {
        if (newItems[i].parent_field_id === dup.field_id) di = i + 1;
        else break;
      }
      newItems.splice(di, 0, dupEl);
    });

    setItems(newItems);
    setElementNames((prev) => ({ ...prev, [sectionFieldId]: "" }));
  };

  // ── Remove Element ────────────────────────────────────────────────────────────
  const removeElement = (sectionFieldId: string, elementFieldId: string) => {
    const element = items.find((i) => i.field_id === elementFieldId);
    if (!element) return;
    const elementLabel = element.label;
    confirm({
      message: `Hapus elemen "${elementLabel}"?`,
      header: "Konfirmasi Hapus",
      confirmText: "Ya, Hapus",
      onConfirm: () => {
        setItems((prev) => {
          let updated = prev.filter((i) => i.field_id !== elementFieldId);
          getDuplicatesForSection(prev, sectionFieldId).forEach((dup) => {
            const corr = getElementsForSection(updated, dup.field_id).find((el) => el.label === elementLabel);
            if (corr) updated = updated.filter((i) => i.field_id !== corr.field_id);
          });
          return updated;
        });
      },
    });
  };

  // ── Remove Section ────────────────────────────────────────────────────────────
  const removeSection = (sectionFieldId: string) => {
    const section = items.find((i) => i.field_id === sectionFieldId);
    if (!section) return;
    const duplicates = getDuplicatesForSection(items, sectionFieldId);
    confirm({
      message: duplicates.length > 0
        ? `Hapus section "${section.label}" dan ${duplicates.length} duplikatnya?`
        : `Hapus section "${section.label}"?`,
      header: "Konfirmasi Hapus",
      confirmText: "Ya, Hapus",
      onConfirm: () => {
        setItems((prev) => {
          const toDelete = new Set([sectionFieldId, ...duplicates.map((d) => d.field_id)]);
          return prev.filter((i) => !toDelete.has(i.field_id) && !toDelete.has(i.parent_field_id || ""));
        });
      },
    });
  };

  // ── Duplicate / Remove Duplicate Section ──────────────────────────────────────
  const duplicateSection = (sectionFieldId: string) => {
    const origIdx = items.findIndex((s) => s.field_id === sectionFieldId);
    if (origIdx === -1) return;
    const original = items[origIdx];
    if (!original.is_repeatable) return;

    const dupFieldId = uuidv4();
    const dupSection: FormField = {
      ...JSON.parse(JSON.stringify(original)),
      field_id: dupFieldId,
      parent_field_id: original.field_id,
      sort_order: getDuplicatesForSection(items, sectionFieldId).length + 1,
      value: "",
    };

    let insertIndex = origIdx + 1;
    for (let i = origIdx + 1; i < items.length; i++) {
      if (items[i].parent_field_id === sectionFieldId) insertIndex = i + 1;
      else break;
    }

    const newItems = [...items];
    newItems.splice(insertIndex, 0, dupSection);
    insertIndex++;

    getElementsForSection(items, sectionFieldId).forEach((el, idx) => {
      newItems.splice(insertIndex, 0, {
        ...JSON.parse(JSON.stringify(el)),
        field_id: uuidv4(),
        parent_field_id: dupFieldId,
        sort_order: idx + 1,
        value: getInitialValue(el.field_type, el.default_value),
      });
      insertIndex++;
    });

    setItems(newItems);
  };

  const removeDuplicate = (sectionFieldId: string) => {
    const section = items.find((s) => s.field_id === sectionFieldId);
    if (!section || section.parent_field_id === null) return;
    confirm({
      message: `Hapus duplikat section "${section.label}"?`,
      header: "Konfirmasi Hapus",
      confirmText: "Ya, Hapus",
      onConfirm: () => {
        setItems((prev) => prev.filter((i) => i.parent_field_id !== sectionFieldId && i.field_id !== sectionFieldId));
      },
    });
  };

  // ── Settings Modal ────────────────────────────────────────────────────────────
  const openSettings = (sectionId: string, elementId: string) => {
    const el = items.find((i) => i.field_id === elementId);
    if (!el) return;
    setEditingSectionId(sectionId);
    setEditingElementId(elementId);
    setElementSettings({
      label: el.label || "", field_type: el.field_type as any,
      field_key: el.field_key || "", default_value: el.default_value || "",
      prefix_text: el.prefix_text || "", suffix_text: el.suffix_text || "",
      cols: el.cols || "auto", placeholder: el.placeholder || "",
      field_options: el.field_options || "", min_value: el.min_value || "",
      max_value: el.max_value || "", is_required: el.is_required || false,
      api_w_option: el.api_w_option || "", field_w_ref: el.field_w_ref || "",
      category: el.category || "", description: el.description || "",
      is_active: el.is_active !== undefined ? el.is_active : true,
      is_auto_suggest: el.is_auto_suggest || false,
    });
    setOptionType(el.api_w_option ? "api" : "static");
    setSettingsOpen(true);
  };

  const saveSettings = () => {
    if (!editingSectionId || !editingElementId) return;
    const final = { ...elementSettings };
    if (optionType === "static") { final.api_w_option = ""; final.field_w_ref = ""; final.category = ""; }
    else { final.field_options = ""; if (final.api_w_option !== "kluster") final.category = ""; }

    setItems((prev) => {
      const elementLabel = prev.find((i) => i.field_id === editingElementId)?.label;
      const updated = prev.map((item) =>
        item.field_id !== editingElementId ? item
          : { ...item, ...final, value: getInitialValue(final.field_type, final.default_value || null) }
      );
      if (editingSectionId) {
        getDuplicatesForSection(updated, editingSectionId).forEach((dup) => {
          const corr = getElementsForSection(updated, dup.field_id).find((el) => el.label === elementLabel);
          if (corr) {
            const idx = updated.findIndex((i) => i.field_id === corr.field_id);
            if (idx !== -1) updated[idx] = { ...updated[idx], ...final, value: getInitialValue(final.field_type, final.default_value || null) };
          }
        });
      }
      return updated;
    });

    if (final.api_w_option) {
      const el = items.find((i) => i.field_id === editingElementId);
      if (el) fetchFieldOptions({ ...el, ...final });
    }
    setSettingsOpen(false);
    setEditingSectionId(null);
    setEditingElementId(null);
    setOptionType("static");
  };

  // ── Edit Section ──────────────────────────────────────────────────────────────
  const openEditSection = (sectionId: string) => {
    const section = items.find((i) => i.field_id === sectionId);
    if (!section) return;
    setEditingSectionData(section);
    setEditSectionLabel(section.label);
    setEditSectionRepeatable(section.is_repeatable);
    setEditSectionOpen(true);
  };

  const saveEditSection = () => {
    if (!editingSectionData) return;
    const wasRepeatable = editingSectionData.is_repeatable;
    const isNowRepeatable = editSectionRepeatable;

    if (wasRepeatable && !isNowRepeatable) {
      const duplicates = getDuplicatesForSection(items, editingSectionData.field_id);
      if (duplicates.length > 0) {
        confirm({
          message: `Mengubah section menjadi non-repetitive akan menghapus ${duplicates.length} duplikat. Lanjutkan?`,
          header: "Konfirmasi",
          confirmText: "Ya, Lanjutkan",
          onConfirm: () => {
            setItems((prev) => {
              const toDelete = new Set(duplicates.map((d) => d.field_id));
              return prev
                .filter((i) => !toDelete.has(i.field_id) && !toDelete.has(i.parent_field_id || ""))
                .map((i) => i.field_id === editingSectionData.field_id ? { ...i, label: editSectionLabel, is_repeatable: false } : i);
            });
            setEditSectionOpen(false);
          },
        });
        return;
      }
    }

    setItems((prev) => prev.map((i) =>
      i.field_id === editingSectionData.field_id ? { ...i, label: editSectionLabel, is_repeatable: isNowRepeatable } : i
    ));
    setEditSectionOpen(false);
  };

  // ── Drag: Sections ────────────────────────────────────────────────────────────
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sidebarSections.findIndex((s) => s.field_id === active.id);
    const newIdx = sidebarSections.findIndex((s) => s.field_id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(sidebarSections, oldIdx, newIdx);
    const newItems: FormField[] = [];
    reordered.forEach((section) => {
      newItems.push(section);
      const addChildren = (parentId: string) => {
        items.filter((i) => i.parent_field_id === parentId).forEach((child) => {
          newItems.push(child);
          if (child.field_type === "SECTION") addChildren(child.field_id);
        });
      };
      addChildren(section.field_id);
    });
    setItems(newItems);
  };

  // ── Drag: Elements ────────────────────────────────────────────────────────────
  const handleReorderElements = (sectionFieldId: string, newOrder: FormField[]) => {
    newOrder.forEach((el, idx) => { el.sort_order = idx + 1; });
    const duplicates = getDuplicatesForSection(items, sectionFieldId);
    const orderMap: Record<string, number> = {};
    newOrder.forEach((el, idx) => { orderMap[el.label] = idx; });

    const processedIds = new Set<string>();
    const reorderedIds = new Set(newOrder.map((el) => el.field_id));
    const newItems: FormField[] = [];

    items.forEach((item) => {
      if (processedIds.has(item.field_id)) return;
      if (item.field_id === sectionFieldId) {
        newItems.push(item);
        processedIds.add(item.field_id);
        newOrder.forEach((el) => { newItems.push(el); processedIds.add(el.field_id); });
        duplicates.forEach((dup) => {
          if (processedIds.has(dup.field_id)) return;
          newItems.push(dup);
          processedIds.add(dup.field_id);
          getElementsForSection(items, dup.field_id)
            .sort((a, b) => (orderMap[a.label] ?? 999) - (orderMap[b.label] ?? 999))
            .forEach((el, idx) => { el.sort_order = idx + 1; newItems.push(el); processedIds.add(el.field_id); });
        });
      } else if (
        reorderedIds.has(item.field_id) ||
        duplicates.some((d) => d.field_id === item.field_id) ||
        duplicates.some((d) => item.parent_field_id === d.field_id && item.field_type !== "SECTION")
      ) {
        return;
      } else {
        newItems.push(item);
        processedIds.add(item.field_id);
      }
    });
    setItems(newItems);
  };

  // ── Save ──────────────────────────────────────────────────────────────────────
  const validateAndSave = () => {
    if (items.length === 0) { showErrorToast("Section tidak boleh kosong"); return; }
    const dupKeys = getDuplicateFieldKeys(items);
    if (dupKeys.length > 0) { showErrorToast(`Field Key duplikat: ${dupKeys.join(", ")}`); return; }

    confirm({
      message: "Simpan template form ini?",
      header: "Konfirmasi",
      confirmText: "Ya, Simpan",
      onConfirm: () => {
        showSuccessToast("Template Form Berhasil Disimpan");
        navigate(-1);
      },
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-0 min-h-screen">

      {/* ── Left Sidebar ─────────────────────────────────────────────────────── */}
      <div className="w-100 shrink-0 border-r border-default-200 flex flex-col gap-4 pr-4 overflow-y-auto">

        {/* Add Section Card */}
        <Card className="px-1" shadow="sm">
          <CardHeader className="pb-0 text-sm font-semibold">Section</CardHeader>
          <CardBody>
            <div className={form()}>
              <AppTextInput
                label="Nama Section"
                isRequired
                value={sectionName}
                onValueChange={(v) => { setSectionName(v); setSectionNameError(""); }}
                isInvalid={!!sectionNameError}
                errorMessage={sectionNameError}
              />
              <Checkbox isSelected={isRepeatable} onValueChange={setIsRepeatable}>
                Repetitive
              </Checkbox>
              <Button
                color="primary"
                variant="bordered"
                startContent={<Plus size={16} />}
                onPress={addSection}
                fullWidth
              >
                Tambah Section
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Sections List */}
        {sidebarSections.length > 0 && (
          <DndContext sensors={sectionSensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
            <SortableContext items={sidebarSections.map((s) => s.field_id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {sidebarSections.map((section, index) => (
                  <SectionPanel
                    key={section.field_id}
                    section={section}
                    index={index}
                    items={items}
                    elementName={elementNames[section.field_id] || ""}
                    onElementNameChange={(v) => setElementNames((prev) => ({ ...prev, [section.field_id]: v }))}
                    onAddElement={() => addElement(section.field_id)}
                    onOpenSettings={openSettings}
                    onRemoveElement={removeElement}
                    onOpenEditSection={openEditSection}
                    onRemoveSection={removeSection}
                    onReorderElements={handleReorderElements}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* ── Right Preview Panel ───────────────────────────────────────────────── */}
      <div className="flex-1 pl-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Preview Form</h2>
          <div className={actionButtons()}>
            {isDeleteForm && (
              <Button color="danger" variant="solid" className={button()}>
                Hapus Form
              </Button>
            )}
            <Button color="primary" variant="flat" className={button()} onPress={() => navigate(-1)}>
              Batal
            </Button>
            <Button color="primary" className={button()} startContent={<Save size={15} />} onPress={validateAndSave}>
              Simpan
            </Button>
          </div>
        </div>
        <Divider className="mb-4" />

        {sidebarSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-default-400">
            <FileQuestion size={64} strokeWidth={1} />
            <p className="mt-4 text-sm">Belum ada section. Tambahkan section untuk melihat preview.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {allSections.map((section) => {
              const sectionElements = getElementsForSection(items, section.field_id);
              const isDuplicate = section.parent_field_id !== null;

              return (
                <Card
                  key={section.field_id}
                  className={`px-1 ${isDuplicate ? "border-l-4 border-l-primary-300" : ""}`}
                  shadow="sm"
                >
                  <CardHeader className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{section.label || "Untitled Section"}</span>
                      {isDuplicate && <Chip size="sm" color="primary" variant="flat">Duplikat</Chip>}
                    </div>
                    <div className="flex gap-1">
                      {section.is_repeatable && !isDuplicate && (
                        <Button isIconOnly size="sm" variant="light" color="primary" onPress={() => duplicateSection(section.field_id)}>
                          <Copy size={14} />
                        </Button>
                      )}
                      {isDuplicate && (
                        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => removeDuplicate(section.field_id)}>
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardBody>
                    {sectionElements.length > 0 ? (
                      <div className="grid grid-cols-12 gap-4">
                        {sectionElements.map((element) => (
                          <div key={element.field_id} className={colsClass[element.cols] || colsClass.auto}>
                            <PreviewElement
                              element={element}
                              fieldApiOptions={fieldApiOptions}
                              onValueChange={updateItemValue}
                            />
                            {element.description && (
                              <p className="text-xs text-default-400 mt-1">{element.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-default-400 text-center py-3">
                        Belum ada elemen dalam section ini
                      </p>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Settings Modal ────────────────────────────────────────────────────── */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => { setSettingsOpen(false); setOptionType("static"); }}
        onSave={saveSettings}
        settings={elementSettings}
        onSettingsChange={setElementSettings}
        optionType={optionType}
        onOptionTypeChange={setOptionType}
        availableApiEndpoints={availableApiEndpoints}
        availableCategories={availableCategories}
        availableReferenceFields={availableReferenceFields}
        editingElementId={editingElementId}
        items={items}
      />

      {/* ── Edit Section Modal ────────────────────────────────────────────────── */}
      <EditSectionModal
        isOpen={editSectionOpen}
        onClose={() => setEditSectionOpen(false)}
        onSave={saveEditSection}
        label={editSectionLabel}
        onLabelChange={setEditSectionLabel}
        isRepeatable={editSectionRepeatable}
        onRepeatableChange={setEditSectionRepeatable}
      />
    </div>
  );
}
