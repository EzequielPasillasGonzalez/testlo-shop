export const normalizar_slug = (slug: string): string => {
  return slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
};
