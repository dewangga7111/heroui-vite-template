import { Button, Dropdown } from "@heroui/react";
import { EllipsisVertical, Trash2, Pencil, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RenderCellProps } from "@/types/table";
import { useConfirmation } from "@/contexts/confirmation-context";
import { useAppDispatch } from "@/redux/hooks";
import { deleteRole } from "@/pages/roles/store/api";

export default function RolesRenderCell({ item, columnKey }: RenderCellProps) {
  const key = String(columnKey);
  const cellValue = (item as any)[key];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { confirm } = useConfirmation();

  switch (key) {
    case "action":
      return (
        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="ghost" size="sm" isIconOnly>
              <EllipsisVertical size={18} />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover placement="right" className="min-w-32">
            <Dropdown.Menu aria-label="Role actions">
              <Dropdown.Item
                key="permission"
                onAction={() => navigate(`/roles/permission/${item.id}`)}
              >
                <span className="flex items-center gap-2"><Lock size={13} />Permission</span>
              </Dropdown.Item>
              <Dropdown.Item
                key="edit"
                onAction={() => navigate(`/roles/edit/${item.id}`)}
              >
                <span className="flex items-center gap-2"><Pencil size={13} />Edit</span>
              </Dropdown.Item>
              <Dropdown.Item
                key="delete"
                className="text-danger"
                onAction={() =>
                  confirm({
                    message: "Are you sure you want to delete this data?",
                    onConfirm: () => dispatch(deleteRole(item.id)),
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
