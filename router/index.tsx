export function isActive(href: string): boolean | undefined {
  return window.location.pathname === href;
}
