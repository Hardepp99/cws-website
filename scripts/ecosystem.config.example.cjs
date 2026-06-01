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
        CWS_NODE_CMS: "1",
        MYSQL_HOST: "127.0.0.1",
        MYSQL_DATABASE: "cws_cms",
        MYSQL_USER: "cws",
        MYSQL_PASSWORD: "change-me",
        CWS_UPLOAD_DIR: "/var/www/cws-website/data/uploads",
        REVALIDATE_SECRET: "change-me",
        CWS_SESSION_SECRET: "change-me",
      },
    },
  ],
};
