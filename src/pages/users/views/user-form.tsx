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
import { createUser, getUserById, updateUser } from "@/pages/users/store/api";
import { actionButtons, button, form, inputContainer } from "@/components/primitives";
import constants from "@/utils/constants";

interface UserFormPageProps {
  isEdit?: boolean;
}

export default function UserFormPage({ isEdit = false }: UserFormPageProps) {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { confirm } = useConfirmation();
  const store = useSelector((state: RootState) => state.users);

  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    dispatch(getUserById(userId));
  }, [userId]);

  useEffect(() => {
    if (!isEdit) return;
    if (!store.loading) setFetching(false);
  }, [store.loading]);

  useEffect(() => {
    if (store.success) {
      showSuccessToast(constants.toast.SUCCESS_SAVE);
      navigate(constants.path.USERS);
    } else if (store.error) {
      showErrorToast(store.error);
    }
  }, [store.loading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    confirm({
      message: isEdit ? constants.confirmation.UPDATE : constants.confirmation.SAVE,
      onConfirm: () => {
        if (isEdit) {
          dispatch(updateUser(userId, data as any));
        } else {
          dispatch(createUser(data as any));
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
                <AppTextInput isRequired name="firstName" label="First Name" defaultValue={store.detail?.name} />
                <AppTextInput isRequired name="lastName" label="Last Name" />
                <AppTextInput name="email" label="Email" type="email" defaultValue={store.detail?.email} />
                <AppTextInput name="phone" label="Phone" type="number" defaultValue={store.detail?.phone} />
                <AppTextarea name="address" label="Address" defaultValue={store.detail?.address} />
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
