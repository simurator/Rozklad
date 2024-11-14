export interface Lesson {
  id: number; 
  subject: string;  // Przedmiot
  teacher: string;  // Nauczyciel
  classroom: string;
  startTime: Date;  // Czas rozpoczęcia
  endTime: Date;    // Czas zakończenia
  day: string;
  durationMinutes?: number;
}
