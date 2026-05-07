
import { Button, Card, Form, Switch, Table } from "@heroui/react";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/contexts/confirmation-context";
import { RootState } from "@/redux/store";
import { actionButtons, button, form } from "@/components/primitives";

export default function EditPermissionPage() {
  const navigate = useNavigate();
  const store = useSelector((state: RootState) => state.roles);
  const { confirm } = useConfirmation();

  const [permissions, setPermissions] = useState([
    { id: 1, name: "Home", read: false, add: false, edit: false, delete: false },
    { id: 2, name: "Users", read: false, add: false, edit: false, delete: false },
    { id: 3, name: "Roles", read: false, add: false, edit: false, delete: false },
    { id: 4, name: "Division", read: false, add: false, edit: false, delete: false },
  ]);

  useEffect(() => {
    if (store.success) {
      showSuccessToast("Data Saved Successfully");
      navigate("/roles");
    } else if (store.error) {
      showErrorToast(store.error);
    }
  }, [store.loading]);

  const handleToggle = (menuId: number, key: keyof Omit<typeof permissions[0], "id" | "name">) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.id === menuId ? { ...item, [key]: !item[key] } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirm({
      message: "Are you sure you want to save this data?",
      onConfirm: () => doSave(),
    });
  };

  const doSave = () => {
    console.log("Saving permissions:", permissions);
    showSuccessToast("Data Saved Successfully");
    navigate("/roles");
  };

  return (
    <div>
      <Card>
        <Card.Content>
          <span className="text-lg">Role: <span className="font-medium">Admin</span></span>

          <Form className="mt-3" onSubmit={handleSubmit}>
            <div className={form()}>
              <Table variant="secondary">
                <Table.Content>
                  <Table.Header>
                    <Table.Column id="menu">Menu</Table.Column>
                    <Table.Column id="read" style={{ width: "150px", textAlign: "center" }}>Read</Table.Column>
                    <Table.Column id="add" style={{ width: "150px", textAlign: "center" }}>Add</Table.Column>
                    <Table.Column id="edit" style={{ width: "150px", textAlign: "center" }}>Edit</Table.Column>
                    <Table.Column id="delete" style={{ width: "150px", textAlign: "center" }}>Delete</Table.Column>
                  </Table.Header>

                  <Table.Body>
                    {permissions.map((menu) => (
                      <Table.Row key={menu.id}>
                        <Table.Cell>{menu.name}</Table.Cell>
                        <Table.Cell style={{ textAlign: "center" }}>
                          <Switch
                            isSelected={menu.read}
                            onChange={() => handleToggle(menu.id, "read")}
                          >
                            <Switch.Control><Switch.Thumb /></Switch.Control>
                          </Switch>
                        </Table.Cell>
                        <Table.Cell style={{ textAlign: "center" }}>
                          <Switch
                            isSelected={menu.add}
                            onChange={() => handleToggle(menu.id, "add")}
                          >
                            <Switch.Control><Switch.Thumb /></Switch.Control>
                          </Switch>
                        </Table.Cell>
                        <Table.Cell style={{ textAlign: "center" }}>
                          <Switch
                            isSelected={menu.edit}
                            onChange={() => handleToggle(menu.id, "edit")}
                          >
                            <Switch.Control><Switch.Thumb /></Switch.Control>
                          </Switch>
                        </Table.Cell>
                        <Table.Cell style={{ textAlign: "center" }}>
                          <Switch
                            isSelected={menu.delete}
                            onChange={() => handleToggle(menu.id, "delete")}
                          >
                            <Switch.Control><Switch.Thumb /></Switch.Control>
                          </Switch>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>

              <div className={`${actionButtons()} mt-3`}>
                <Button type="button" variant="secondary" className={button()} onPress={() => navigate(-1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" className={button()}>
                  <Save size={15} />
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
