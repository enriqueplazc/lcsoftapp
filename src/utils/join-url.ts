export const joinUrl = (base: string, ...path: string[]) => {
  return `${base}/${path.join('/')}`;
};
