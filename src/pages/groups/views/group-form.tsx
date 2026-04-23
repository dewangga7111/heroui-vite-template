import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Form } from "@heroui/react";
import { Save } from "lucide-react";

import AppTextInput from "@/components/forms/app-text-input";
import AppAutocomplete from "@/components/forms/app-autocomplete";
import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/contexts/confirmation-context";
import { AppDispatch, RootState } from "@/redux/store";
import { createGroup, getGroupById, updateGroup } from "@/pages/groups/store/api";
import { actionButtons, button, form, inputContainer } from "@/components/primitives";

const CATEGORY_OPTIONS = [
  { label: "Minimarket", value: "minimarket" },
  { label: "Supermarket", value: "supermarket" },
  { label: "Hypermarket", value: "hypermarket" },
  { label: "Convenience Store", value: "convenience_store" },
  { label: "Toko Kelontong", value: "toko_kelontong" },
  { label: "Toko Grosir", value: "toko_grosir" },
  { label: "Apotek", value: "apotek" },
  { label: "Toko Elektronik", value: "toko_elektronik" },
  { label: "Toko Pakaian", value: "toko_pakaian" },
  { label: "Toko Alat Tulis", value: "toko_alat_tulis" },
];

interface GroupFormPageProps {
  isEdit?: boolean;
}

export default function GroupFormPage({ isEdit = false }: GroupFormPageProps) {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { confirm } = useConfirmation();
  const store = useSelector((state: RootState) => state.groups);

  const [fetching, setFetching] = useState(isEdit);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    dispatch(getGroupById(groupId));
  }, [groupId]);

  useEffect(() => {
    if (!isEdit) return;
    if (!store.loading) {
      setFetching(false);
      setCategory(store.detail?.category || "");
    }
  }, [store.loading]);

  useEffect(() => {
    if (store.success) {
      showSuccessToast("Data Saved Successfully");
      navigate("/groups");
    } else if (store.error) {
      showErrorToast(store.error);
    }
  }, [store.loading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const payload = { ...data, category };
    confirm({
      message: isEdit ? "Are you sure you want to update this data?" : "Are you sure you want to save this data?",
      onConfirm: () => {
        if (isEdit) {
          dispatch(updateGroup(groupId, payload as any));
        } else {
          dispatch(createGroup(payload as any));
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
                  name="group_name"
                  label="Group Name"
                  defaultValue={store.detail?.group_name}
                />
                <AppAutocomplete
                  isRequired
                  label="Category"
                  placeholder="Pilih kategori jenis toko"
                  selectedKey={category}
                  items={CATEGORY_OPTIONS}
                  onSelectionChange={(v) => setCategory(v as string || "")}
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
