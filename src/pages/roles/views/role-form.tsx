import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Form } from "@heroui/react";
import { Save } from "lucide-react";

import AppTextInput from "@/components/forms/app-text-input";
import AppTextarea from "@/components/forms/app-textarea";
import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/contexts/confirmation-context";
import { AppDispatch, RootState } from "@/redux/store";
import { createRole, getRoleById, updateRole } from "@/pages/roles/store/api";
import { actionButtons, button, form, inputContainer } from "@/components/primitives";

interface RoleFormPageProps {
  isEdit?: boolean;
}

export default function RoleFormPage({ isEdit = false }: RoleFormPageProps) {
  const { id } = useParams<{ id: string }>();
  const roleId = Number(id);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { confirm } = useConfirmation();
  const store = useSelector((state: RootState) => state.roles);

  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    dispatch(getRoleById(roleId));
  }, [roleId]);

  useEffect(() => {
    if (!isEdit) return;
    if (!store.loading) setFetching(false);
  }, [store.loading]);

  useEffect(() => {
    if (store.success) {
      showSuccessToast("Data Saved Successfully");
      navigate("/roles");
    } else if (store.error) {
      showErrorToast(store.error);
    }
  }, [store.loading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    confirm({
      message: isEdit ? "Are you sure you want to update this data?" : "Are you sure you want to save this data?",
      onConfirm: () => {
        if (isEdit) {
          dispatch(updateRole(roleId, data as any));
        } else {
          dispatch(createRole(data as any));
        }
      },
    });
  };

  if (fetching) return null;

  return (
    <div>
      <Card className="px-1">
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <div className={form()}>
              <div className={inputContainer()}>
                <AppTextInput
                  isRequired
                  name="role_name"
                  label="Name"
                  defaultValue={store.detail?.role_name}
                />
                <AppTextarea
                  isRequired
                  name="description"
                  label="Description"
                  defaultValue={store.detail?.description}
                />
              </div>
              <div className={actionButtons()}>
                <Button type="button" color="primary" variant="flat" className={button()} onPress={() => navigate(-1)}>
                  Back
                </Button>
                <Button type="submit" color="primary" className={button()} startContent={<Save size={15} />}>
                  {isEdit ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
