
import { Button, Card, CardBody, Form } from "@heroui/react";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import AppTextInput from "@/components/forms/app-text-input";
import AppTextarea from "@/components/forms/app-textarea";
import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/contexts/confirmation-context";
import { RootState } from "@/redux/store";
import { actionButtons, button, form, inputContainer } from "@/components/primitives";
import constants from "@/utils/constants"

export default function AddRolesPage() {
  const navigate = useNavigate();
  const store = useSelector((state: RootState) => state.roles);
  const { confirm } = useConfirmation();

  useEffect(() => {
    if (store.success) {
      showSuccessToast(constants.toast.SUCCESS_SAVE)
      navigate(constants.path.ROLES)
    } else if (store.error) {
      showErrorToast(store.error)
    }
  }, [store.loading])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    confirm({
      message: constants.confirmation.SAVE,
      onConfirm: () => {
        doSave(data)
      },
    });
  };

  const doSave = (_data: any) => {
    showSuccessToast(constants.toast.SUCCESS_SAVE);
    navigate(constants.path.ROLES);
  }

  return (
    <div>
      <Card className="px-1">
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <div className={form()}>
              <div className={inputContainer()}>
                <AppTextInput
                  isRequired
                  key='role_name'
                  name='role_name'
                  label='Name'
                />
                <AppTextarea
                  isRequired
                  key='description'
                  name='description'
                  label='Description'
                />
              </div>

              <div className={actionButtons()}>
                <Button
                  type="button"
                  color="primary"
                  variant="flat"
                  className={button()}
                  onPress={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className={button()}
                  startContent={<Save size={15} />}
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
