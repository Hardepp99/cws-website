/**
 * Content API — loads from Node CMS (`/api/v1`) via MySQL.
 */
import { cmsApiEnabled } from "@/lib/cms/client";
import * as cms from "@/lib/cms/api";
import * as wp from "./api-wp";

export async function getLayoutBootstrap() {
  if (cmsApiEnabled()) return cms.getLayoutBootstrap();
  const [settings, menus, pricing] = await Promise.all([
    wp.getSiteSettings(),
    wp.getMenus(),
    wp.getPricingOptions(),
  ]);
  return { settings, menus, pricing };
}
export async function getSiteSettings() {
  return cmsApiEnabled() ? cms.getSiteSettings() : wp.getSiteSettings();
}
export async function getPricingOptions() {
  return cmsApiEnabled() ? cms.getPricingOptions() : wp.getPricingOptions();
}
export async function getMenus() {
  return cmsApiEnabled() ? cms.getMenus() : wp.getMenus();
}
export async function getHomepage() {
  return cmsApiEnabled() ? cms.getHomepage() : wp.getHomepage();
}
export async function getPageBySlug(slug: string) {
  return cmsApiEnabled() ? cms.getPageBySlug(slug) : wp.getPageBySlug(slug);
}
export async function getServiceLanding(slug: string) {
  return cmsApiEnabled() ? cms.getServiceLanding(slug) : wp.getServiceLanding(slug);
}
export async function getAllServiceLandings() {
  return cmsApiEnabled() ? cms.getAllServiceLandings() : wp.getAllServiceLandings();
}
export async function getServiceDetail(slug: string) {
  return cmsApiEnabled() ? cms.getServiceDetail(slug) : wp.getServiceDetail(slug);
}
export async function getContentBySlug(slug: string) {
  return cmsApiEnabled() ? cms.getContentBySlug(slug) : wp.getContentBySlug(slug);
}
export async function getAllSlugs() {
  return cmsApiEnabled() ? cms.getAllSlugs() : wp.getAllSlugs();
}
export async function getBlogPosts() {
  return cmsApiEnabled() ? cms.getBlogPosts() : wp.getBlogPosts();
}
export async function getBlogPost(slug: string) {
  return cmsApiEnabled() ? cms.getBlogPost(slug) : wp.getBlogPost(slug);
}
export async function getPortfolioHome() {
  return cms.getPortfolioHome();
}
export async function getPortfolioAll() {
  return cms.getPortfolioAll();
}
export async function getPortfolioBySlug(slug: string) {
  return cms.getPortfolioBySlug(slug);
}
export async function getPortfolioSlugs() {
  return cms.getPortfolioSlugs();
}
export async function getGmbLive() {
  return cms.getGmbLive();
}
