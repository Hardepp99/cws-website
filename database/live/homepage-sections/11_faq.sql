-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: faq
UPDATE homepage_sections
SET sort_order = 11, layout = 'faq', status = 'published',
    admin_title = 'FAQ',
    payload = '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Answers for serious buyers","subtitle":"SEO-friendly questions founders ask before a $5k-$100k+ engagement - use Ask price for a quick estimate range.","items":[{"icon":"fas fa-calculator","title":"How does the project cost calculator work?","desc":"Choose project type, features, and timeline in Ask price - we reply within one business day with a realistic range and next steps.","tone":"green"},{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, languages, and compliance. You receive written options after discovery, not vague guesses.","tone":"blue"},{"icon":"fas fa-clock","title":"How fast can you launch?","desc":"Marketing sites often ship in 3-6 weeks. Apps and platforms follow a milestone roadmap shared before kickoff.","tone":"purple"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission when required.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Daily. Video workshops, async updates, staging reviews, and contracts in English across time zones.","tone":"grey"}]}'
WHERE page_id = @page_id AND layout = 'faq' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 11, 'faq', 'published', 'FAQ', '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Answers for serious buyers","subtitle":"SEO-friendly questions founders ask before a $5k-$100k+ engagement - use Ask price for a quick estimate range.","items":[{"icon":"fas fa-calculator","title":"How does the project cost calculator work?","desc":"Choose project type, features, and timeline in Ask price - we reply within one business day with a realistic range and next steps.","tone":"green"},{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, languages, and compliance. You receive written options after discovery, not vague guesses.","tone":"blue"},{"icon":"fas fa-clock","title":"How fast can you launch?","desc":"Marketing sites often ship in 3-6 weeks. Apps and platforms follow a milestone roadmap shared before kickoff.","tone":"purple"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission when required.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Daily. Video workshops, async updates, staging reviews, and contracts in English across time zones.","tone":"grey"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'faq' AND hs.status <> 'trash'
  );
