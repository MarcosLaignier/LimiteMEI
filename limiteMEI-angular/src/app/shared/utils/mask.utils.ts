export type FieldMask = 'cnpj' | 'cpf' | 'telefone' | 'cep';

export class MaskUtils {
  private static readonly patterns: Record<FieldMask, string> = {
    cnpj: 'AA.AAA.AAA/AAAA-00', cpf: '000.000.000-00',
    telefone: '(00) 00000-0000', cep: '00000-000'
  };

  static normalize(value: unknown, alphanumeric = false): string {
    const text = String(value ?? '').toUpperCase();
    return alphanumeric ? text.replace(/[^A-Z0-9]/g, '') : text.replace(/\D/g, '');
  }

  static normalizeField(value: unknown, mask: FieldMask): string {
    if (mask === 'cnpj') {
      const characters = this.normalize(value, true);
      return characters.slice(0, 12) + characters.slice(12).replace(/\D/g, '').slice(0, 2);
    }
    const limits: Record<Exclude<FieldMask, 'cnpj'>, number> = { cpf: 11, telefone: 11, cep: 8 };
    return this.normalize(value).slice(0, limits[mask]);
  }

  static formatField(value: unknown, mask: FieldMask): string {
    return this.apply(this.normalizeField(value, mask), this.patterns[mask]);
  }

  static apply(value: unknown, pattern: string): string {
    const source = this.normalize(value, pattern.includes('A'));
    let result = '';
    let index = 0;
    for (const token of pattern) {
      if (index >= source.length) break;
      if (token === '0' || token === 'A') {
        if (token === '0' && !/\d/.test(source[index])) break;
        result += source[index++];
      } else {
        result += token;
      }
    }
    return result;
  }

  static maxLength(mask: FieldMask): number { return this.patterns[mask].length; }
}
