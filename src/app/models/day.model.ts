import { Lesson } from './lesson.model'; // Importujemy model Lesson, aby go użyć w Day

export interface Day {
  dayName: string;  // Nazwa dnia (np. "Monday")
  lessons: Lesson[];  // Tablica lekcji w danym dniu
}
