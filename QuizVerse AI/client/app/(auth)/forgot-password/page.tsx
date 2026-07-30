import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Password reset is not wired yet"
    >
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-sm text-slate-300">
        The forgot-password form is not implemented yet.
      </div>
    </AuthLayout>
  );
}