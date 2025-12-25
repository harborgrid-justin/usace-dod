
import { UserRole } from '../types';

/**
 * Sanitizes string input to prevent injection attacks in descriptions and reference fields.
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

/**
 * Validates if the active user has the required role for a sensitive cross-module action.
 */
export const validateAuthority = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

/**
 * Cryptographically secure ID generator for transaction integrity.
 */
export const generateSecureId = (prefix: string): string => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return `${prefix}-${array[0].toString(16).toUpperCase()}`;
};
