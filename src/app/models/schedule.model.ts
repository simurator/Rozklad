// schedule.model.ts
import { Lesson } from './lesson.model';

export interface Schedule {
  day: string;
  lessons: Lesson[];
}
export interface Day {
  dayName: string;  // Nazwa dnia (np. "Monday")
  
}
// lesson.model.ts

