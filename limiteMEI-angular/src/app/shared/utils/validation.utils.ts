import { MaskUtils } from './mask.utils';

export class ValidationUtils {
  static required(value: unknown): boolean {
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }

  static cnpj(value: unknown): boolean {
    const normalized = MaskUtils.normalizeField(value, 'cnpj');
    return normalized.length === 14 && /^([A-Z\d]{12})(\d{2})$/.test(normalized);
  }

  static requiredFields<T extends object>(model: T, fields: (keyof T)[]): boolean {
    return fields.every(field => this.required(model[field]));
  }
}
