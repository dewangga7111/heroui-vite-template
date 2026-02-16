
import {
  Button,
  getKeyValue,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { EllipsisVertical, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import constants from "@/shared/utils/constants";
import { RenderCellProps } from "@/shared/types/table";
import { formatEllipsis, showSuccessToast } from "@/shared/utils/common";
import { useConfirmation } from "@/shared/contexts/confirmation-context";
import { ManagedPopover } from "@/shared/components/popover/managed-popover";

export default function UsersRenderCell({ item, columnKey }: RenderCellProps) {
  const key = String(columnKey);
  const cellValue = getKeyValue(item, key);
  const navigate = useNavigate();
  const { confirm } = useConfirmation();

  switch (key) {
    case "email":
      return <div>{formatEllipsis(cellValue, 20)}</div>;

    case "action":
      return (
        <ManagedPopover
          placement="right"
          trigger={ 
            <Button
              variant="light"
              size="sm"
              isIconOnly
            >
              <EllipsisVertical size={18} />
            </Button>
          }
        >
          <Listbox aria-label="User actions" variant="flat">
            <ListboxItem
              key="edit"
              startContent={<Pencil size={13}/>}
              onPress={() => {
                navigate(`${constants.path.USERS}/edit/${item.id}`);
              }}
            >
              Edit
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={13}/>}
              onPress={() => {
                confirm({
                  message: constants.confirmation.DELETE,
                  onConfirm: () => {
                    showSuccessToast(constants.toast.SUCCESS_DELETE);
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
