// recursive check if item or children is active
export const isMenuActive = (item: any, pathname: string): boolean => {
  // Exact match for root path
  if (item.path === '/' && pathname === '/') return true;
  // For other paths, check if pathname starts with the path
  if (item.path && item.path !== '/' && pathname.startsWith(item.path)) return true;
  // Check children recursively
  if (item.children) {
    return item.children.some((child: any) => {
      return isMenuActive(child, pathname)
    });
  }
  return false;
};
