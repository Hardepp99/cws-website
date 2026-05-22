"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client";

type Stats = {
  overview: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    totalViews: number;
  };
  counts: Record<string, number>;
  formsTotal: number;
  performance: { date: string; views: number }[];
  topPages: { path: string; slug: string; views: number }[];
  seoIssues: { type: string; title: string; slug: string; issue: string }[];
  recentForms: { form_type: string; created_at: string }[];
  hasAnalytics: boolean;
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminFetch<Stats>("/dashboard/stats")
      .then(setStats)
      .catch((e) => setErr(String(e)));
  }, []);

  if (err) {
    return <div className="cms-notice err">{err}</div>;
  }

  if (!stats) {
    return <p>Loading dashboard…</p>;
  }

  const maxViews = Math.max(...stats.performance.map((d) => Number(d.views)), 1);

  return (
    <div className="gsc-dashboard">
      <div className="gsc-dash-header">
        <h1 className="gsc-dash-title">Performance</h1>
        <p className="gsc-dash-sub">
          Last 28 days · {stats.hasAnalytics ? "Live page views from your site" : "Run migration 002 for page view tracking"}
        </p>
      </div>

      <div className="gsc-metrics">
        <div className="gsc-metric-card">
          <span className="gsc-metric-label">Total clicks</span>
          <strong className="gsc-metric-value">{stats.overview.clicks.toLocaleString()}</strong>
          <span className="gsc-metric-hint">Form leads (30 days)</span>
        </div>
        <div className="gsc-metric-card">
          <span className="gsc-metric-label">Impressions</span>
          <strong className="gsc-metric-value">{stats.overview.impressions.toLocaleString()}</strong>
          <span className="gsc-metric-hint">Page views + estimated reach</span>
        </div>
        <div className="gsc-metric-card">
          <span className="gsc-metric-label">Average CTR</span>
          <strong className="gsc-metric-value">{stats.overview.ctr}%</strong>
        </div>
        <div className="gsc-metric-card">
          <span className="gsc-metric-label">Avg. position</span>
          <strong className="gsc-metric-value">{stats.overview.position}</strong>
          <span className="gsc-metric-hint">Connect GSC API later</span>
        </div>
      </div>

      <div className="gsc-grid-2">
        <div className="cms-card gsc-panel">
          <h2>Traffic (28 days)</h2>
          {stats.performance.length === 0 ? (
            <p className="gsc-empty">No view data yet. Browse the public site to collect stats.</p>
          ) : (
            <div className="gsc-chart" role="img" aria-label="Traffic chart">
              {stats.performance.map((d) => (
                <div key={d.date} className="gsc-chart-bar-wrap" title={`${d.date}: ${d.views} views`}>
                  <div
                    className="gsc-chart-bar"
                    style={{ height: `${Math.max(8, (Number(d.views) / maxViews) * 100)}%` }}
                  />
                  <span className="gsc-chart-label">{String(d.date).slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cms-card gsc-panel">
          <h2>Content index</h2>
          <ul className="gsc-index-list">
            <li><span>Published URLs</span><strong>{stats.counts.published}</strong></li>
            <li><span>Drafts</span><strong>{stats.counts.drafts}</strong></li>
            <li><span>Pages</span><strong>{stats.counts.pages}</strong></li>
            <li><span>Blog posts</span><strong>{stats.counts.blog}</strong></li>
            <li><span>Landings</span><strong>{stats.counts.landings}</strong></li>
            <li><span>Services</span><strong>{stats.counts.services}</strong></li>
            <li><span>Homepage sections</span><strong>{stats.counts.sections}</strong></li>
            <li><span>All form submissions</span><strong>{stats.formsTotal}</strong></li>
          </ul>
        </div>
      </div>

      <div className="gsc-grid-2">
        <div className="cms-card gsc-panel">
          <h2>Top pages</h2>
          {stats.topPages.length === 0 ? (
            <p className="gsc-empty">No page data yet.</p>
          ) : (
            <table className="gsc-data-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.map((p) => (
                  <tr key={p.path}>
                    <td>
                      <code>{p.path}</code>
                    </td>
                    <td>{Number(p.views).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="cms-card gsc-panel">
          <h2>SEO recommendations</h2>
          {stats.seoIssues.length === 0 ? (
            <p className="gsc-empty good">No critical SEO issues detected.</p>
          ) : (
            <ul className="gsc-issues-list">
              {stats.seoIssues.map((issue, i) => (
                <li key={i}>
                  <span className="gsc-issue-type">{issue.type}</span>
                  <strong>{issue.title}</strong>
                  <span className="gsc-issue-msg">{issue.issue}</span>
                </li>
              ))}
            </ul>
          )}
          <p style={{ marginTop: 12 }}>
            <Link href="/admin/site-pages">Improve pages →</Link>
          </p>
        </div>
      </div>

      <div className="cms-card gsc-panel">
        <h2>Recent conversions</h2>
        <table className="gsc-data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentForms.map((f, i) => (
              <tr key={i}>
                <td>{f.created_at}</td>
                <td>{f.form_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          <Link href="/admin/forms">All submissions →</Link>
        </p>
      </div>

      <div className="cms-card gsc-quick-links">
        <h2>Quick edit</h2>
        <div className="gsc-quick-grid">
          <Link href="/admin/homepage">Homepage sections</Link>
          <Link href="/admin/site-pages">Pages</Link>
          <Link href="/admin/blog">Blog</Link>
          <Link href="/admin/services">Services</Link>
          <Link href="/admin/landings">Landings</Link>
          <Link href="/admin/settings">Site settings</Link>
        </div>
      </div>
    </div>
  );
}
