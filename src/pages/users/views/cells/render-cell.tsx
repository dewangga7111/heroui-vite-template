import { Button, getKeyValue, Listbox, ListboxItem } from "@heroui/react";
import { EllipsisVertical, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RenderCellProps } from "@/types/table";
import { useConfirmation } from "@/contexts/confirmation-context";
import { ManagedPopover } from "@/components/popover/managed-popover";
import { useAppDispatch } from "@/redux/hooks";
import { deleteUser } from "@/pages/users/store/api";

export default function UsersRenderCell({ item, columnKey }: RenderCellProps) {
  const key = String(columnKey);
  const cellValue = getKeyValue(item, key);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { confirm } = useConfirmation();

  switch (key) {
    case "nama_kota":
      return <div>{cellValue || "-"}</div>;

    case "supervisor_name":
      return <div>{cellValue || "-"}</div>;

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
          <Listbox aria-label="User actions" variant="flat">
            <ListboxItem
              key="edit"
              startContent={<Pencil size={13} />}
              onPress={() => navigate(`/users/edit/${item.user_id}`)}
            >
              Edit
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={13} />}
              onPress={() =>
                confirm({
                  message: "Are you sure you want to delete this data?",
                  onConfirm: () => dispatch(deleteUser(item.user_id)),
                })
              }
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
