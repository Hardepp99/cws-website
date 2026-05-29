import { SiteLayout } from "@/components/layout/SiteLayout";
import { SignupForm } from "@/components/member/SignupForm";

export default function SignupPage() {
  return (
    <SiteLayout currentPath="/account/signup">
      <section className="member-auth-page">
        <SignupForm />
      </section>
    </SiteLayout>
  );
}
