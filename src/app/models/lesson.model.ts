export interface Lesson {
  subject: string;  // Przedmiot
  teacher: string;  // Nauczyciel
  classroom: string;
  startTime: Date;  // Czas rozpoczęcia
  endTime: Date;    // Czas zakończenia
  day: string;      // Dzień tygodnia (np. "Monday")
}
