-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: process
UPDATE homepage_sections
SET sort_order = 5, layout = 'process', status = 'published',
    admin_title = 'Process',
    payload = '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Simple process","title":"From kickoff to live in four confident steps","subtitle":"No black boxes. Most engagements start with a focused discovery call and a clear proposal within days.","steps":[{"icon":"fas fa-comments","title":"Discover & define","description":"We unpack goals, users, integrations, and success metrics - then send a written scope and investment range."},{"icon":"fas fa-pencil-ruler","title":"Design to approve","description":"Wireframes or high-fidelity UI you sign off on - brand, UX, and mobile views included."},{"icon":"fas fa-code","title":"Build in the open","description":"Real staging URLs on phone and desktop; structured feedback until the experience feels right."},{"icon":"fas fa-rocket","title":"Launch & optimise","description":"Go-live, analytics, training, and optional SEO, ads, or maintenance - keep momentum after day one."}]}'
WHERE page_id = @page_id AND layout = 'process' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 5, 'process', 'published', 'Process', '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Simple process","title":"From kickoff to live in four confident steps","subtitle":"No black boxes. Most engagements start with a focused discovery call and a clear proposal within days.","steps":[{"icon":"fas fa-comments","title":"Discover & define","description":"We unpack goals, users, integrations, and success metrics - then send a written scope and investment range."},{"icon":"fas fa-pencil-ruler","title":"Design to approve","description":"Wireframes or high-fidelity UI you sign off on - brand, UX, and mobile views included."},{"icon":"fas fa-code","title":"Build in the open","description":"Real staging URLs on phone and desktop; structured feedback until the experience feels right."},{"icon":"fas fa-rocket","title":"Launch & optimise","description":"Go-live, analytics, training, and optional SEO, ads, or maintenance - keep momentum after day one."}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'process' AND hs.status <> 'trash'
  );
