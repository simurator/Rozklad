import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson.model';  // Import the Lesson model
import { Day } from '../models/day.model';  // Import the Day model


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private schedule: Day[] = [
    { dayName: 'Monday', lessons: [] },
    { dayName: 'Tuesday', lessons: [] },
    { dayName: 'Wednesday', lessons: [] },
    { dayName: 'Thursday', lessons: [] },
    { dayName: 'Friday', lessons: [] },
    { dayName: 'Saturday', lessons: [] },
    { dayName: 'Sunday', lessons: [] }
  ];

  constructor() { }

  getSchedule(): Day[] {
    return this.schedule;  // Return the schedule array (of type Day[])
  }

  addLesson(dayName: string, lesson: Lesson): void {
    const day = this.schedule.find(d => d.dayName === dayName);

    if (day) {
      // Upewnij się, że startTime jest typu Date
      if (!(lesson.startTime instanceof Date)) {
        lesson.startTime = new Date(lesson.startTime); // jeśli startTime jest np. stringiem, konwertujemy go na Date
      }

      // Dodanie nowej lekcji
      day.lessons.push(lesson);

      // Posortowanie lekcji i przypisanie nowej tablicy
      day.lessons = day.lessons.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }
  }




  deleteLesson(dayName: string, lesson: Lesson): void {
    const day = this.schedule.find(d => d.dayName === dayName);
    if (day) {
      const index = day.lessons.indexOf(lesson);
      if (index > -1) {
        day.lessons.splice(index, 1);
      }
    }
  }

  editLesson(dayName: string, oldLesson: Lesson, updatedLesson: Lesson): void {
    const day = this.schedule.find(d => d.dayName === dayName);
    if (day) {
      const index = day.lessons.indexOf(oldLesson);
      if (index > -1) {
        day.lessons[index] = updatedLesson;
        // Optionally, sort by start time
        day.lessons.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      }
    }
  }
}
