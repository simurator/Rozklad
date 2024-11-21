import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Lesson } from '../../models/lesson.model';
import { Day } from '../../models/day.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ScheduleComponent implements OnInit {
  schedule: Day[] = [];
  editingLessons: { [key: string]: { [key: number]: boolean } } = {};
  validationErrors: { [key: string]: { [key: number]: string } } = {};

  constructor(
    private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.schedule = this.scheduleService.getSchedule();
    this.initEditingLessons();
  }

  private initEditingLessons(): void {
    this.editingLessons = {};
    this.validationErrors = {};

    this.schedule.forEach(day => {
      this.editingLessons[day.dayName] = {};
      this.validationErrors[day.dayName] = {};

      day.lessons.forEach((_, index) => {
        this.editingLessons[day.dayName][index] = false;
        this.validationErrors[day.dayName][index] = '';
      });
    });
  }

  deleteLesson(dayName: string, lesson: Lesson): void {
    this.scheduleService.deleteLesson(dayName, lesson);
    this.schedule = this.scheduleService.getSchedule();
    this.initEditingLessons();
  }

  addLesson(dayName: string): void {
    const day = this.schedule.find(d => d.dayName === dayName);

    if (day) {
      const newLesson: Lesson = {
        day: dayName,
        id: day.lessons.length + 1,
        subject: '',
        teacher: '',
        classroom: '',
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 0
      };

      this.scheduleService.addLesson(dayName, newLesson);
      this.schedule = this.scheduleService.getSchedule();
      this.initEditingLessons();
    }
  }

  startEditing(dayName: string, lessonIndex: number): void {
    Object.keys(this.editingLessons[dayName]).forEach(key => {
      this.editingLessons[dayName][parseInt(key)] = false;
      this.validationErrors[dayName][parseInt(key)] = '';
    });

    this.editingLessons[dayName][lessonIndex] = true;
  }

  validateTimes(dayName: string, lessonIndex: number): boolean {
    const lesson = this.schedule.find(d => d.dayName === dayName)?.lessons[lessonIndex];

    if (!lesson) return false;

    const startTime = lesson.startTime instanceof Date
      ? lesson.startTime.getTime()
      : new Date(lesson.startTime).getTime();

    const endTime = lesson.endTime instanceof Date
      ? lesson.endTime.getTime()
      : new Date(lesson.endTime).getTime();

    if (startTime >= endTime) {
      this.validationErrors[dayName][lessonIndex] = 'Start time must be before end time';
      return false;
    }

    this.validationErrors[dayName][lessonIndex] = '';
    return true;
  }

  saveEdit(dayName: string, lessonIndex: number): void {
    if (!this.validateTimes(dayName, lessonIndex)) {
      return;
    }

    const lesson = this.schedule.find(d => d.dayName === dayName)?.lessons[lessonIndex];

    if (lesson) {
      this.scheduleService.updateLesson(dayName, lesson);
    }

    this.editingLessons[dayName][lessonIndex] = false;
    this.cdr.detectChanges();
  }

  cancelEditing(dayName: string, lessonIndex: number): void {
    this.editingLessons[dayName][lessonIndex] = false;
    this.validationErrors[dayName][lessonIndex] = '';
    this.schedule = this.scheduleService.getSchedule();
    this.cdr.detectChanges();
  }

  isEditing(dayName: string, lessonIndex: number): boolean {
    return this.editingLessons[dayName][lessonIndex];
  }

  getValidationError(dayName: string, lessonIndex: number): string {
    return this.validationErrors[dayName][lessonIndex] || '';
  }
}
