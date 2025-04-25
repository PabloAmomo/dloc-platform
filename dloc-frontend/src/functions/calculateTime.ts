export type CalculateTime = {
  text: string;
  seconds: number;
};

const calculateTime = (date: Date | undefined, textToUse?: any): CalculateTime => {
  if (!date) return { text: '', seconds: 0 };
  let e: number = Math.floor((Date.now() - date.getTime()) / 1000);
  let i: number = Math.floor(e / 31536000);
  let x: number = Math.floor(e / 2592000);
  let s: number = Math.floor(e / 86400);
  let o: number = Math.floor(e / 3600);
  let h: number = Math.floor(e / 60);
  let text = textToUse ?? i18n;
  return {
    text: (i > 1
      ? text.prefix + ' ' + i + ' ' + text.year + ' ' + text.postfix
      : i > 1
      ? text.prefix + ' ' + i + ' ' + text.years + ' ' + text.postfix
      : x === 1
      ? text.prefix + ' ' + x + ' ' + text.month + ' ' + text.postfix
      : x > 1
      ? text.prefix + ' ' + x + ' ' + text.months + ' ' + text.postfix
      : s === 1
      ? text.prefix + ' ' + s + ' ' + text.day + ' ' + text.postfix
      : s > 1
      ? text.prefix + ' ' + s + ' ' + text.days + ' ' + text.postfix
      : o === 1
      ? text.prefix + ' ' + o + ' ' + text.hour + ' ' + text.postfix
      : o > 1
      ? text.prefix + ' ' + o + ' ' + text.hours + ' ' + text.postfix
      : h === 1
      ? text.prefix + ' ' + h + ' ' + text.minute + ' ' + text.postfix
      : h > 1
      ? text.prefix + ' ' + h + ' ' + text.minutes + ' ' + text.postfix
      : text.now
    ).trim(),
    seconds: e,
  };
};

const i18n = {
  prefix: 'Hace',
  postfix: '',
  now: 'ahora mismo',
  year: 'año',
  years: 'años',
  month: 'mes',
  months: 'meses',
  day: 'día',
  days: 'días',
  hour: 'hora',
  hours: 'horas',
  minute: 'min.',
  minutes: 'min.',
};

export default calculateTime;
