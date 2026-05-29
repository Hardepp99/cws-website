import { SiteLayout } from "@/components/layout/SiteLayout";
import { LoginForm } from "@/components/member/LoginForm";

export default function LoginPage() {
  return (
    <SiteLayout currentPath="/account/login">
      <section className="member-auth-page">
        <LoginForm />
      </section>
    </SiteLayout>
  );
}
