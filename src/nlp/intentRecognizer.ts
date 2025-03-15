export class IntentRecognizer {
    recognize(text: string): string {
      const lowerText = text.toLowerCase();
      
      if (/показан|передать|отправить/i.test(lowerText)) {
        return 'submit_reading';
      }
      
      if (/счет|договор|лицевой/i.test(lowerText)) {
        return 'account_identification';
      }
      
      if (/счетчик|выбрать/i.test(lowerText)) {
        return 'counter_selection';
      }
      
      if (/помощь|help|справка/i.test(lowerText)) {
        return 'help';
      }
      
      return 'unknown';
    }
  }
