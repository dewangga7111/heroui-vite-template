import { Button, Dropdown } from "@heroui/react";
import { EllipsisVertical, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RenderCellProps } from "@/types/table";
import { useConfirmation } from "@/contexts/confirmation-context";
import { useAppDispatch } from "@/redux/hooks";
import { deleteUser } from "@/pages/users/store/api";

export default function UsersRenderCell({ item, columnKey }: RenderCellProps) {
  const key = String(columnKey);
  const cellValue = (item as any)[key];
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
        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="ghost" size="sm" isIconOnly>
              <EllipsisVertical size={18} />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover placement="right" className="min-w-32">
            <Dropdown.Menu aria-label="User actions">
              <Dropdown.Item
                key="edit"
                onAction={() => navigate(`/users/edit/${item.user_id}`)}
              >
                <span className="flex items-center gap-2"><Pencil size={13} />Edit</span>
              </Dropdown.Item>
              <Dropdown.Item
                key="delete"
                className="text-danger"
                onAction={() =>
                  confirm({
                    message: "Are you sure you want to delete this data?",
                    onConfirm: () => dispatch(deleteUser(item.user_id)),
                  })
                }
              >
                <span className="flex items-center gap-2"><Trash2 size={13} />Delete</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      );

    default:
      return cellValue;
  }
}
