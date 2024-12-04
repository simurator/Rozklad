import { Injectable } from '@angular/core';
import { Day } from '../models/day.model';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly STORAGE_KEY = 'school-schedule';

  constructor() { }

  // Inicjalizacja domyślnego harmonogramu, jeśli nie ma zapisanych danych
  private getDefaultSchedule(): Day[] {
    return [
      {
        dayName: 'Poniedziałek',
        lessons: [
          {
            id: 1,
            day: 'Poniedziałek',
            subject: 'Matematyka',
            teacher: 'Jan Kowalski',
            classroom: '101',
            startTime: new Date(),
            endTime: new Date()
           
          }
        ]
      },
      { dayName: 'Wtorek', lessons: [] },
      { dayName: 'Środa', lessons: [] },
      { dayName: 'Czwartek', lessons: [] },
      { dayName: 'Piątek', lessons: [] }
    ];
  }

  // Pobranie harmonogramu z localStorage
  getSchedule(): Day[] {
    const storedSchedule = localStorage.getItem(this.STORAGE_KEY);

    if (storedSchedule) {
      // Konwersja dat z ciągów na obiekty Date
      const parsedSchedule: Day[] = JSON.parse(storedSchedule, this.reviveDates);
      return parsedSchedule;
    }

    // Jeśli brak danych, zwróć domyślny harmonogram
    return this.getDefaultSchedule();
  }

  // Zapis harmonogramu do localStorage
  saveSchedule(schedule: Day[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(schedule));
  }

  // Dodanie lekcji
  addLesson(dayName: string, lesson: Lesson): void {
    const schedule = this.getSchedule();
    const day = schedule.find(d => d.dayName === dayName);

    if (day) {
      day.lessons.push(lesson);
      this.saveSchedule(schedule);
    }
  }

  // Usunięcie lekcji
  deleteLesson(dayName: string, lesson: Lesson): void {
    const schedule = this.getSchedule();
    const day = schedule.find(d => d.dayName === dayName);

    if (day) {
      const index = day.lessons.findIndex(l => l.id === lesson.id);
      if (index !== -1) {
        day.lessons.splice(index, 1);

        // Przywróć numerację ID
        day.lessons.forEach((l, idx) => {
          l.id = idx + 1;
        });

        this.saveSchedule(schedule);
      }
    }
  }

  // Metoda do aktualizacji lekcji
  updateLesson(dayName: string, updatedLesson: Lesson): void {
    const schedule = this.getSchedule();
    const day = schedule.find(d => d.dayName === dayName);

    if (day) {
      const lessonIndex = day.lessons.findIndex(l => l.id === updatedLesson.id);
      if (lessonIndex !== -1) {
        day.lessons[lessonIndex] = updatedLesson;
        console.log('Updated Lesson:', updatedLesson);
        this.saveSchedule(schedule);
      } else {
        console.error('Lesson not found:', updatedLesson.id);
      }
    } else {
      console.error('Day not found:', dayName);
    }
  }

  // Własna metoda revivre do poprawnej konwersji dat
  private reviveDates(key: string, value: any): any {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z?$/;
    if (typeof value === "string" && dateFormat.test(value)) {
      return new Date(value);
    }
    return value;
  }
}
