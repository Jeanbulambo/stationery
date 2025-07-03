const unités = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
    'dix-sept', 'dix-huit', 'dix-neuf'
  ];

  const dizaines = [
    '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante',
    'soixante', 'quatre-vingt', 'quatre-vingt'
  ];

  function convertirCentaines(n) {
    if (n === 0) return '';
    if (n === 1) return 'cent';
    return unités[n] + ' cent';
  }

  function convertirDizaines(n) {
    if (n < 20) return unités[n];
    let dix = Math.floor(n / 10);
    let unit = n % 10;
    let mot = dizaines[dix];
    if (dix === 7 || dix === 9) unit += 10;

    if (unit === 1 && dix !== 8) return mot + ' et un';
    if (unit > 0) return mot + '-' + unités[unit];
    return mot;
  }

  function segmentNombre(n) {
    const parts = [];
    let reste = n;

    const milliards = Math.floor(reste / 1_000_000_000);
    if (milliards > 0) {
      parts.push(convertirNombre(milliards) + ' milliard' + (milliards > 1 ? 's' : ''));
      reste %= 1_000_000_000;
    }

    const millions = Math.floor(reste / 1_000_000);
    if (millions > 0) {
      parts.push(convertirNombre(millions) + ' million' + (millions > 1 ? 's' : ''));
      reste %= 1_000_000;
    }

    const milliers = Math.floor(reste / 1_000);
    if (milliers > 0) {
      if (milliers === 1) parts.push('mille');
      else parts.push(convertirNombre(milliers) + ' mille');
      reste %= 1_000;
    }

    if (reste > 0) {
      parts.push(convertirNombre(reste));
    }

    return parts.join(' ');
  }

  function convertirNombre(n) {
    if (n === 0) return 'zéro';
    const centaines = Math.floor(n / 100);
    const reste = n % 100;
    let result = '';

    if (centaines > 0) {
      result += convertirCentaines(centaines);
      if (reste > 0) result += ' ';
    }

    result += convertirDizaines(reste);
    return result.trim();
  }

  /**
   * Fonction principale : convertit un montant en lettres (CDF ou USD).
   * Exemple : nombreEnLettres(1270, 'FC') → "mille deux cent soixante-dix francs congolais"
   */
  export default function nombreEnLettres(montant, devise = 'FC') {
    const n = Math.floor(montant);
    const decimal = Math.round((montant - n) * 100);
    let texte = segmentNombre(n);
    let suffixe = devise === 'USD' ? 'dollars' : 'francs congolais';
    let centimes = '';

    if (decimal > 0) {
      centimes = ` et ${segmentNombre(decimal)} centimes`;
    }

    return `${texte} ${suffixe}${centimes}`.trim();
  }
