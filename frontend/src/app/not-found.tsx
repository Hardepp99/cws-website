import Link from "next/link";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout currentPath="">
      <section className="py-5 text-center" style={{ minHeight: "50vh", paddingTop: 120 }}>
        <div className="container">
          <h1>404</h1>
          <p>Page not found.</p>
          <Link href="/" className="btn btn-primary-custom mt-3">
            Back to Home
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
