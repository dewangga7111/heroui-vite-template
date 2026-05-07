import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppTextInput from "@/components/forms/app-text-input";
import AppTextInputPassword from "@/components/forms/app-text-input-password";
import { Button, Card, Form, Spinner } from "@heroui/react";
import Footer from "@/components/footer";
import { showErrorToast, showSuccessToast } from "@/utils/common";
import { isMobile } from "react-device-detect";
import { ShinyText, BlurText, SplitText } from "@/components/text-animations";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login, getProfile } from "@/pages/auth/store/api";
import { resetAuth } from "@/pages/auth/store/reducer";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((s) => s.auth);
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (success) {
      showSuccessToast("Login Successfully");
      dispatch(resetAuth());
      dispatch(getProfile());
      navigate("/");
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
      dispatch(resetAuth());
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  const form = () => (
    <Form onSubmit={handleSubmit}>
      <AppTextInput
        isRequired
        name="username"
        label="Username"
        value={username}
        onChange={setUsername}
        isDisabled={loading}
      />
      <AppTextInputPassword
        isRequired
        name="password"
        label="Password"
        value={password}
        onChange={setPassword}
        isDisabled={loading}
      />
      <Button
        type="submit"
        variant="primary"
        className="w-full mt-5"
        isDisabled={loading}
      >
        {loading ? <div className="flex items-center justify-center"><Spinner color="current" size="sm" className="block size-4" /></div> : <LogIn size={15} />}
        Login
      </Button>
    </Form>
  );

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
            <ShinyText className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary-300">
              Welcome Back
            </ShinyText>
            <span className="text-sm text-default-600 mt-3">
              Enter your username and password to access your account
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
      <Card className="max-w-6xl w-[90%] h-[70%] shadow-2xl p-0">
        <Card.Content className="grid grid-cols-2 gap-0 p-0 h-full">
          <div className="w-full h-full bg-gradient-to-br from-primary-600 via-primary-500 to-primary-300 rounded-l-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <div className="absolute left-8 top-8 z-10">
              <div className="text-4xl font-bold text-white">
                <BlurText duration={1} delay={0.3} splitBy="characters">
                  HeroUI
                </BlurText>
              </div>
              <div className="text-sm text-white/80 mt-2">
                <SplitText duration={0.5} delay={0.3} splitBy="words">
                  Admin Dashboard
                </SplitText>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 text-white/90 text-sm z-10">
              <p className="font-medium">Modern Admin Template</p>
              <p className="text-white/70 mt-1">Built with React, TypeScript, and HeroUI</p>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="w-full py-5 px-15 flex-grow flex flex-col justify-center">
              <div className="flex flex-col justify-center items-start mb-12">
                <ShinyText className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary-300">
                  Welcome Back
                </ShinyText>
                <span className="text-sm text-default-600 mt-3">
                  Enter your username and password to access your account
                </span>
              </div>
              {form()}
            </div>
            <Footer />
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
