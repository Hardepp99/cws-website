export default function SlugLoading() {
  return (
    <div className="corp-section text-center" style={{ minHeight: "50vh", paddingTop: 120 }}>
      <div className="spinner-border text-primary" role="status" style={{ width: 48, height: 48 }} />
      <p className="mt-3 text-muted">Loading page…</p>
    </div>
  );
}
