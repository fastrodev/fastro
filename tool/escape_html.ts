import DOMPurify from "npm:isomorphic-dompurify";

export function escapeHTML(htmlString: string) {
  const sanitizedHTML = DOMPurify.sanitize(htmlString);
  return sanitizedHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(
    />/g,
    "&gt;",
  ).replace(/"/g, "&quot;");
}
