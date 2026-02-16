import { Button, Card, CardBody, Form } from "@heroui/react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppTextInput from "@/shared/components/forms/app-text-input";
import { showSuccessToast } from "@/shared/utils/common";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Login data:", data);

    // Mock login - in real app, this would call an API
    showSuccessToast("Login successful!");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardBody className="gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-default-500">Sign in to your account</p>
          </div>

          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AppTextInput
              isRequired
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <AppTextInput
              isRequired
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              color="primary"
              className="w-full"
              startContent={<LogIn size={18} />}
            >
              Sign In
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
