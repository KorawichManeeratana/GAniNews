import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BadgeCheck } from "lucide-react";
import GoogleLoginButton from "./googleLogionButton";

export const LoginModal = ({ open, onOpenChange, onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [tabValue, setTabValue] = useState("otp");

  // loading states แยกตาม action
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        // ข้อผิดพลาดจาก backend
        throw new Error(data?.message || "Login failed");
      }

      if (typeof onLoginSuccess === "function") onLoginSuccess();
      onOpenChange?.(false);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };
  const passwordvalidations = {
    length: registerData.password.length >= 8,
    upper: /[A-Z]/.test(registerData.password),
    lower: /[a-z]/.test(registerData.password),
    number: /\d/.test(registerData.password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(registerData.password),
  };

  const isValidPassword = Object.values(passwordvalidations).every(Boolean); //เช็คว่าทุกเงื่อนไขผ่านหมดไหม
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidPassword) {
      setError("Password does not meet all requirements.");
      return; // หยุดการทำงานถ้ารหัสผ่านไม่ผ่าน
    }

    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (registerLoading) return;
    setRegisterLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          confirmPassword: registerData.confirmPassword,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Register failed");
      }

      setTabValue("otp");
      setRegistering(true);
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterConfirmation = async (e) => {
    e.preventDefault();
    setError(null);
    if (confirmLoading) return;
    setConfirmLoading(true);
    try {
      const res = await fetch("/api/auth/registerConfirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          confirmPassword: registerData.confirmPassword,
          confirmationCode: registerData.otp,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Register Comfirmed failed");
      }

      setTabValue("login");
      setRegistering(false);
    } catch (err) {
      console.error("Register Confirmed error:", err);
      setError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to GAniNews</DialogTitle>
          <DialogDescription className="text-center">
            Join the community of anime and gaming enthusiasts
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tabValue}
          onValueChange={(v) => setTabValue(v)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </div>
              {loginLoading ? (
                <img
                  src="images/cat_loading.gif"
                  alt="Loading..."
                  className="w-15 h-15 object-contain align-middle mx-auto"
                  aria-live="polite"
                />
              ) : (
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              )}
            </form>
          </TabsContent>

          {registering ? (
            /* เมื่อ Register แล้วจะมี OTP ส่งไปที่ email จะแสดงให้ใส่ที่นี่  */
            <TabsContent value="otp" className="space-y-4 mt-6">
              <form onSubmit={handleRegisterConfirmation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-enter">Enter OTP Code</Label>
                  <div className="flex flex-col-1 justify-center">
                    <>
                      <InputOTP
                        maxLength={6}
                        value={registerData.otp}
                        onChange={(value) =>
                          setRegisterData({ ...registerData, otp: value })
                        }
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </>
                    <div className="text-center text-sm">
                      {registerData.otp === "" ? (
                        <>Enter your one-time password.</>
                      ) : (
                        <>You entered: {registerData.otp}</>
                      )}
                    </div>
                  </div>
                </div>
                {confirmLoading ? (
                  <img
                    src="images/cat_loading.gif"
                    alt="Loading..."
                    className="w-15 h-15 object-contain align-middle mx-auto"
                    aria-live="polite"
                  />
                ) : (
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                )}
              </form>
            </TabsContent>
          ) : (
            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {registerLoading ? (
                  <img
                    src="images/cat_loading.gif"
                    alt="Loading..."
                    className="w-15 h-15 object-contain align-middle mx-auto"
                    aria-live="polite"
                  />
                ) : (
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                )}
                <div className="text-xs space-y-1 mt-2">
                  <span
                    className={`flex items-center gap-1 ${
                      passwordvalidations.length
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    <BadgeCheck widths={5} height={15} />
                    Password must be at least 8 characters.
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      passwordvalidations.upper
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    <BadgeCheck widths={5} height={15} />
                    Password must contain capital letter.
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      passwordvalidations.lower
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    <BadgeCheck widths={5} height={15} />
                    Password must contain lowercase letter.
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      passwordvalidations.number
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    <BadgeCheck widths={5} height={15} />
                    Password must contain number.
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      passwordvalidations.symbol
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    <BadgeCheck widths={5} height={15} />
                    Password must contain symbol.
                  </span>
                </div>
              </form>
              <>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </>
            </TabsContent>
          )}
        </Tabs>

        {registering ? (
          <></>
        ) : (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 align-middle">
              <GoogleLoginButton />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
