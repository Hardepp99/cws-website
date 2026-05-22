/**
 * Content API — uses CWS PHP CMS when CMS_API_URL is set, otherwise WordPress GraphQL.
 */
import { cmsApiEnabled } from "@/lib/cms/client";
import * as cms from "@/lib/cms/api";
import * as wp from "./api-wp";

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
