import { Button, Card, CardBody } from "@heroui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings, Trash2 } from "lucide-react";
import { FormField, FIELD_TYPE_LABELS } from "@/types/form-builder";

interface Props {
  element: FormField;
  onSettings: () => void;
  onRemove: () => void;
}

export default function SortableElementCard({ element, onSettings, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.field_id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-2 border border-default-200 hover:border-primary-300 hover:shadow-sm transition-all" shadow="none">
        <CardBody className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="cursor-grab active:cursor-grabbing text-default-400 touch-none"
                {...attributes}
                {...listeners}
              >
                <GripVertical size={16} />
              </button>
              <div>
                <p className="text-sm font-medium">{element.label}</p>
                <p className="text-xs text-default-500">
                  {FIELD_TYPE_LABELS[element.field_type] || element.field_type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button isIconOnly size="sm" variant="light" color="primary" onPress={onSettings}>
                <Settings size={14} />
              </Button>
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={onRemove}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
