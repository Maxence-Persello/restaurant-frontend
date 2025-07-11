export interface ServiceSlot {
  id: number;
  dayOfWeek: number;
  name: string;
  startTime: string;
  endTime: string;
}

export const DAY_OF_WEEK_LABELS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];
