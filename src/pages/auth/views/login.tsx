import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppTextInput from "@/components/forms/app-text-input";
import AppTextInputPassword from "@/components/forms/app-text-input-password";
import { Button, Card, CardBody, Form, Checkbox } from "@heroui/react";
import Footer from "@/components/footer";
import { showSuccessToast, showErrorToast } from "@/utils/common";
import { isMobile } from "react-device-detect";
import constants from "@/utils/constants";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    setIsLoading(true);
    try {
      // Mock login - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (formData.user_id === "admin" && formData.password === "admin") {
        showSuccessToast(constants.toast.SUCCESS_LOGIN);

        // Store auth data in localStorage
        localStorage.setItem("isAuthenticated", "true");
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        navigate(constants.path.DASHBOARD);
      } else {
        showErrorToast("Invalid credentials. Try admin/admin");
      }
    } catch (error: any) {
      showErrorToast(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const form = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <AppTextInput
          isRequired
          key="user_id"
          name="user_id"
          label="User ID"
          isDisabled={isLoading}
        />
        <AppTextInputPassword
          isRequired
          key="password"
          name="password"
          label="Password"
          isDisabled={isLoading}
        />
        {/* <Checkbox
          isSelected={rememberMe}
          onValueChange={setRememberMe}
          className="mt-4"
          isDisabled={isLoading}
        >
          Remember me
        </Checkbox> */}
        <Button
          type="submit"
          color="primary"
          className="w-full mt-5"
          startContent={<LogIn size={15} />}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Login
        </Button>
      </Form>
    );
  };

  if (!mounted) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col justify-between px-5 h-full">
        <div className="flex items-center justify-center mt-8">
          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-300">
            HeroUI
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col mb-12">
            <span className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary-300">
              Welcome Back
            </span>
            <span className="text-sm text-default-600 mt-3">
              Enter your user ID and password to access your account
            </span>
          </div>
          {form()}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-[75%] h-[75%] shadow-2xl">
        <CardBody className="grid grid-cols-2 p-0 h-full">
          <div className="w-full h-full bg-gradient-to-br from-primary-600 via-primary-500 to-primary-300 rounded-l-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <div className="absolute left-8 top-8 z-10">
              <div className="text-4xl font-bold text-white">HeroUI</div>
              <div className="text-sm text-white/80 mt-2">Admin Dashboard</div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 text-white/90 text-sm z-10">
              <p className="font-medium">Modern Admin Template</p>
              <p className="text-white/70 mt-1">Built with React, TypeScript, and HeroUI</p>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="w-full py-5 px-15 flex-grow flex flex-col justify-center">
              <div className="flex flex-col justify-center items-start mb-12">
                <span className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary-300">
                  Welcome Back
                </span>
                <span className="text-sm text-default-600 mt-3">
                  Enter your user ID and password to access your account
                </span>
              </div>
              {form()}
            </div>
            <Footer />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
