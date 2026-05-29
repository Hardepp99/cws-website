/**
 * PM2 example — copy to ecosystem.config.cjs and adjust paths + env.
 *   pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: "cws-frontend",
      cwd: "/var/www/cws-website/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://www.example.com",
        NEXT_PUBLIC_CMS_PUBLIC_URL: "https://www.example.com/cms/public",
        CMS_API_URL: "http://127.0.0.1/cms/public",
        REVALIDATE_SECRET: "change-me",
      },
    },
  ],
};
