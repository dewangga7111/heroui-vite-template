import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Spinner } from "@heroui/react";
import { Save } from "lucide-react";

import AppTextInput from "@/components/forms/app-text-input";
import AppTextInputPassword from "@/components/forms/app-text-input-password";
import AppAutocomplete from "@/components/forms/app-autocomplete";
import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/contexts/confirmation-context";
import { AppDispatch, RootState } from "@/redux/store";
import { createUser, getUserById, updateUser } from "@/pages/users/store/api";
import { actionButtons, button, form, inputContainer } from "@/components/primitives";
import { resetUsers } from "../store/reducer";

const ROLE_OPTIONS = [
  { label: "Superadmin", value: "superadmin" },
  { label: "Supervisor", value: "supervisor" },
  { label: "Auditor", value: "auditor" },
  { label: "Surveyor", value: "surveyor" },
];

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
  const [passwordError, setPasswordError] = useState("");

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
      showSuccessToast("Data Saved Successfully");
      dispatch(resetUsers());
      navigate("/users");
    }
  }, [store.success]);

  useEffect(() => {
    if (store.error) showErrorToast(store.error);
  }, [store.error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (!isEdit && data.password !== data.confirm_password) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");

    const { confirm_password, ...rest } = data;

    confirm({
      message: isEdit ? "Are you sure you want to update this data?" : "Are you sure you want to save this data?",
      onConfirm: () => {
        if (isEdit) {
          dispatch(updateUser({ ...rest, user_id: userId } as any));
        } else {
          dispatch(createUser(rest as any));
        }
      },
    });
  };

  if (fetching) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Spinner size="lg" className="block size-8" />
    </div>
  );

  return (
    <div>
      <Card>
        <Card.Content>
          <Form onSubmit={handleSubmit}>
            <div className={form()}>
              <div className={inputContainer()}>
                <AppTextInput isRequired name="name" label="Name" defaultValue={store.detail?.name} />
                <AppTextInput
                  isRequired
                  name="username"
                  label="Username"
                  defaultValue={store.detail?.username}
                  validate={(v: string) => /\s/.test(v) ? "Username must not contain spaces" : true}
                />
                <AppTextInput isRequired name="user_code" label="User Code" defaultValue={store.detail?.user_code} />
                <AppAutocomplete
                  isRequired
                  name="role_name"
                  label="Role"
                  items={ROLE_OPTIONS}
                  itemLabel="label"
                  itemValue="value"
                  selectedKey={store.detail?.role_name?.toLowerCase() ?? ""}
                />
                <AppTextInputPassword isRequired={!isEdit} name="password" label="Password" />
                <AppTextInputPassword
                  isRequired={!isEdit}
                  name="confirm_password"
                  label="Confirm Password"
                  isInvalid={!!passwordError}
                  errorMessage={passwordError}
                  onChange={() => setPasswordError("")}
                />
              </div>
              <div className={actionButtons()}>
                <Button type="button" variant="secondary" className={button()} onPress={() => navigate(-1)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={button()}
                  isDisabled={store.loading}
                >
                  {store.loading ? <Spinner size="sm" className="block size-4" /> : <Save size={15} />}
                  {isEdit ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
