import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Page403() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ShieldAlert size={80} className="text-danger" />
      <h1 className="text-4xl font-bold">403 - Forbidden</h1>
      <p className="text-default-500">You don't have permission to access this page.</p>
      <Button
        color="primary"
        onPress={() => navigate("/")}
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
