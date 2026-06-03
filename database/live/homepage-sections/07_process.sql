-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: process
UPDATE homepage_sections
SET sort_order = 7, layout = 'process', status = 'published',
    admin_title = 'Process',
    payload = '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Development process","title":"Interactive delivery timeline - seven clear phases","subtitle":"Discovery through support - you always know what we are doing this week and what you need to approve.","steps":[{"icon":"fas fa-search","title":"Discovery","description":"Goals, users, integrations, risks, and success metrics captured in a written brief."},{"icon":"fas fa-microscope","title":"Research","description":"Competitive scan, analytics review, and technical spikes before we commit to scope."},{"icon":"fas fa-pencil-ruler","title":"UI/UX","description":"Wireframes and high-fidelity UI you approve - mobile, accessibility, and brand aligned."},{"icon":"fas fa-code","title":"Development","description":"Staging builds, API work, and demos on a predictable sprint cadence."},{"icon":"fas fa-vial","title":"Testing","description":"QA across devices, performance checks, and sign-off checklists before launch."},{"icon":"fas fa-rocket","title":"Launch","description":"Go-live, tracking, training, and handover docs your team can operate."},{"icon":"fas fa-life-ring","title":"Support","description":"Maintenance, iterations, and retainers so momentum continues after day one."}]}'
WHERE page_id = @page_id AND layout = 'process' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 7, 'process', 'published', 'Process', '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Development process","title":"Interactive delivery timeline - seven clear phases","subtitle":"Discovery through support - you always know what we are doing this week and what you need to approve.","steps":[{"icon":"fas fa-search","title":"Discovery","description":"Goals, users, integrations, risks, and success metrics captured in a written brief."},{"icon":"fas fa-microscope","title":"Research","description":"Competitive scan, analytics review, and technical spikes before we commit to scope."},{"icon":"fas fa-pencil-ruler","title":"UI/UX","description":"Wireframes and high-fidelity UI you approve - mobile, accessibility, and brand aligned."},{"icon":"fas fa-code","title":"Development","description":"Staging builds, API work, and demos on a predictable sprint cadence."},{"icon":"fas fa-vial","title":"Testing","description":"QA across devices, performance checks, and sign-off checklists before launch."},{"icon":"fas fa-rocket","title":"Launch","description":"Go-live, tracking, training, and handover docs your team can operate."},{"icon":"fas fa-life-ring","title":"Support","description":"Maintenance, iterations, and retainers so momentum continues after day one."}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'process' AND hs.status <> 'trash'
  );
