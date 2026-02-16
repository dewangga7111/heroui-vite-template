import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function Page403() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-6xl font-bold text-danger">403</h1>
          <p className="text-xl">Unauthorized Access</p>
        </CardHeader>
        <CardBody className="gap-4 items-center">
          <p className="text-center text-default-500">
            You don't have permission to access this page.
          </p>
          <Button color="primary" onPress={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
