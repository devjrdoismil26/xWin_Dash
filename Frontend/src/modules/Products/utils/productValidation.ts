/**
 * Utilitários de validação para produtos
 */

export const productValidator = {
  validateName: (name: string) => {
    return name && name.length > 0;
  },
  validatePrice: (price: number) => {
    return price && price > 0;
  },
  validateDescription: (description: string) => {
    return description && description.length > 0;
  } ;

export const validationUtils = {
  isValidEmail: (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  },
  isValidUrl: (url: string) => {
    try {
      new URL(url);

      return true;
    } catch {
      return false;
    } };
