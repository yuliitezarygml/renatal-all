import { Markup } from 'telegraf';
import { startOfMonth, endOfMonth, getDay, format, addMonths, subMonths, getDate } from 'date-fns';
import { ru } from 'date-fns/locale';

export function getCalendarKeyboard(date: Date, prefix: string) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const daysInMonth = getDate(end);
  const startDay = getDay(start); // 0 = Sunday
  
  const keyboard = [];
  
  // Header: Month Year
  keyboard.push([Markup.button.callback(format(date, 'MMMM yyyy', { locale: ru }), 'ignore')]);
  
  // Days of week
  keyboard.push(['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(d => Markup.button.callback(d, 'ignore')));
  
  let currentWeek = [];
  for (let i = 0; i < startDay; i++) {
    currentWeek.push(Markup.button.callback(' ', 'ignore'));
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${format(date, 'yyyy-MM')}-${i.toString().padStart(2, '0')}`;
    currentWeek.push(Markup.button.callback(i.toString(), `${prefix}_${dateStr}`));
    if (currentWeek.length === 7) {
      keyboard.push(currentWeek);
      currentWeek = [];
    }
  }
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(Markup.button.callback(' ', 'ignore'));
    }
    keyboard.push(currentWeek);
  }
  
  // Footer: Prev / Next
  keyboard.push([
    Markup.button.callback('⬅️', `${prefix}_prev_${format(subMonths(date, 1), 'yyyy-MM')}`),
    Markup.button.callback('➡️', `${prefix}_next_${format(addMonths(date, 1), 'yyyy-MM')}`)
  ]);
  
  return keyboard;
}
