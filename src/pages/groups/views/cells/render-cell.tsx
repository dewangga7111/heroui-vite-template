import { Button, getKeyValue, Listbox, ListboxItem } from "@heroui/react";
import { EllipsisVertical, Trash2, Pencil, WrapText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RenderCellProps } from "@/types/table";
import { showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/contexts/confirmation-context";
import { ManagedPopover } from "@/components/popover/managed-popover";

export default function GroupsRenderCell({ item, columnKey }: RenderCellProps) {
  const key = String(columnKey);
  const cellValue = getKeyValue(item, key);
  const navigate = useNavigate();
  const { confirm } = useConfirmation();

  switch (key) {
    case "action":
      return (
        <ManagedPopover
          placement="right"
          trigger={
            <Button variant="light" size="sm" isIconOnly>
              <EllipsisVertical size={18} />
            </Button>
          }
        >
          <Listbox aria-label="Group actions" variant="flat">
            <ListboxItem
              key="form-builder"
              startContent={<WrapText size={13} />}
              onPress={() => navigate(`/form-builder/${item.id}`)}
            >
              Form Builder
            </ListboxItem>
            <ListboxItem
              key="edit"
              startContent={<Pencil size={13} />}
              onPress={() => navigate(`/groups/edit/${item.id}`)}
            >
              Edit
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={13} />}
              onPress={() => {
                confirm({
                  message: "Are you sure you want to delete this data?",
                  onConfirm: () => {
                    showSuccessToast("Data Deleted Successfully");
                  },
                });
              }}
            >
              Delete
            </ListboxItem>
          </Listbox>
        </ManagedPopover>
      );

    default:
      return cellValue;
  }
}
