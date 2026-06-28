import { LoginForm } from "@/components/auth";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <main className="flex flex-1 items-center justify-center px-4 py-16">
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
