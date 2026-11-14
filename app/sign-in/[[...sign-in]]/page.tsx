import { SignIn, SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={null}>
      <main className="flex items-center justify-center">
        <SignIn /> 
      </main>
    </Suspense>
  );
}