import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, CardBody, Chip } from "@heroui/react";
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
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, ChevronDown, Plus } from "lucide-react";
import AppTextInput from "@/components/forms/app-text-input";
import { FormField } from "@/types/form-builder";
import { getElementsForSection } from "../utils";
import SortableElementCard from "./sortable-element-card";

interface Props {
  section: FormField;
  index: number;
  items: FormField[];
  elementName: string;
  onElementNameChange: (val: string) => void;
  onAddElement: () => void;
  onOpenSettings: (sectionId: string, elementId: string) => void;
  onRemoveElement: (sectionId: string, elementId: string) => void;
  onOpenEditSection: (sectionId: string) => void;
  onRemoveSection: (sectionId: string) => void;
  onReorderElements: (sectionId: string, newOrder: FormField[]) => void;
}

export default function SectionPanel({
  section,
  index,
  items,
  elementName,
  onElementNameChange,
  onAddElement,
  onOpenSettings,
  onRemoveElement,
  onOpenEditSection,
  onRemoveSection,
  onReorderElements,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const elements = getElementsForSection(items, section.field_id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.field_id,
  });

  const elementSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = elements.findIndex((e) => e.field_id === active.id);
    const newIndex = elements.findIndex((e) => e.field_id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorderElements(section.field_id, arrayMove(elements, oldIndex, newIndex));
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className="border border-default-200 rounded-lg overflow-hidden" shadow="none">
        <div
          className="flex items-center justify-between p-3 cursor-pointer select-none"
          onClick={() => setIsOpen((v) => !v)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              className="cursor-grab active:cursor-grabbing text-default-400 touch-none shrink-0"
              onClick={(e) => e.stopPropagation()}
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} />
            </button>
            <span className="font-semibold text-sm truncate">
              {section.label || `Section ${index + 1}`}
            </span>
            <Chip size="sm" color="primary" variant="flat">{elements.length}</Chip>
            {section.is_repeatable && (
              <Chip size="sm" color="secondary" variant="flat">Rep</Chip>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              isIconOnly size="sm" variant="light" color="primary"
              onPress={() => onOpenEditSection(section.field_id)}
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil size={13} />
            </Button>
            <Button
              isIconOnly size="sm" variant="light" color="danger"
              onPress={() => onRemoveSection(section.field_id)}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={13} />
            </Button>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="section-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <CardBody className="pt-0 pb-3 px-3">
                <div className="border border-dashed border-default-300 rounded-lg p-3 bg-default-50">
                  <div className="flex gap-2 mb-3 items-end">
                    <div className="flex-1">
                      <AppTextInput
                        size="sm"
                        label="Nama Element"
                        placeholder="Nama Element"
                        value={elementName}
                        onValueChange={onElementNameChange}
                      />
                    </div>
                    <Button
                      size="sm"
                      color="primary"
                      variant="bordered"
                      startContent={<Plus size={13} />}
                      onPress={onAddElement}
                      className="shrink-0 mb-[2px]"
                    >
                      Tambah
                    </Button>
                  </div>

                  {elements.length > 0 ? (
                    <DndContext sensors={elementSensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={elements.map((e) => e.field_id)} strategy={verticalListSortingStrategy}>
                        {elements.map((el) => (
                          <SortableElementCard
                            key={el.field_id}
                            element={el}
                            onSettings={() => onOpenSettings(section.field_id, el.field_id)}
                            onRemove={() => onRemoveElement(section.field_id, el.field_id)}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <p className="text-xs text-default-400 text-center py-2">Belum ada elemen</p>
                  )}
                </div>
              </CardBody>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
