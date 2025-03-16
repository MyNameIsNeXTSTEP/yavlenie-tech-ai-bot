
  export class EntityExtractor {
    extractAccountNumber(text: string): string | null {
      // Ищем последовательность цифр длиной от 5 до 10 символов
      const match = text.match(/\b\d{4,10}\b/);
      return match ? match[0] : null;
    }
    
    extractReading(text: string): number | null {
      // Ищем числа, возможно с десятичной точкой или запятой
      const match = text.match(/\b\d+([.,]\d+)?\b/);
      if (!match) return null;
      
      // Заменяем запятую на точку и преобразуем в число
      return parseFloat(match[0].replace(',', '.'));
    }
  }
  