"use client";
import React from "react";

export default function GoogleLoginButton() {
  const handleClick = () => {
    // เรียก endpoint บน server ที่จะ redirect ไป Cognito Hosted UI
    window.location.href = "/api/auth/start";
  };

  return (
    <div className="grid grid-cols-1 gap-4 align-middle">
      <button
        onClick={handleClick}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2"
        type="button"
      >
        <img src="/images/google-logo.png" alt="Google" className="h-8 w-8" />
        Login with Google
      </button>
    </div>
  );
}