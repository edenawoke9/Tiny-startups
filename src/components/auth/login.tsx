"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

interface LoginData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    signInWithGoogle,
    signInWithGithub,
    loading: socialLoading,
    error: socialError,
    user,
  } = useFirebaseAuth();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    if (!loginData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(loginData.email)) newErrors.email = "Invalid email";
    if (!loginData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setSubmitMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Here you would use Firebase email/password auth if desired
      await new Promise((res) => setTimeout(res, 1500));
      const isSuccess = Math.random() > 0.3;
      if (isSuccess) {
        setSubmitStatus("success");
        setSubmitMessage("Login successful! Redirecting...");
      } else {
        setSubmitStatus("error");
        setSubmitMessage("Invalid credentials. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-4xl xl:max-w-5xl mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center">
          Sign in to your account
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center mt-2">
          Welcome back! Please enter your details.
        </p>
      </div>
      <div className="w-full max-w-4xl">
        <div className="flex gap-2 w-full py-10">
          {/* Login Form */}
          <div className="space-y-6 w-1/2 flex items-center ">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Email */}
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full h-12 px-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
              {/* Password */}
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full h-12 px-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>
              {/* Alert */}
              {submitStatus !== "idle" && (
                <Alert
                  className={`$ {
                    submitStatus === "success"
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <CheckCircle className="text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="text-red-500 mr-2" />
                  )}
                  <AlertDescription>{submitMessage}</AlertDescription>
                </Alert>
              )}
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-sm disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            {/* Social Login Buttons */}
            <div className="flex flex-col gap-2 mt-6">
              <Button
                type="button"
                onClick={signInWithGoogle}
                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2 justify-center"
                disabled={socialLoading}
              >
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                Sign in with Google
              </Button>
              <Button
                type="button"
                onClick={() => {
                  console.log('GitHub button clicked');
                  signInWithGithub();
                }}
                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2 justify-center"
                disabled={socialLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#181717" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481A10.025 10.025 0 0 0 22 12.021C22 6.484 17.523 2 12 2z"/></svg>
                Sign in with GitHub
              </Button>
              {socialError && <p className="text-red-500 mt-2">{socialError}</p>}
              {socialLoading && <p className="text-gray-500 mt-2">Loading...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
