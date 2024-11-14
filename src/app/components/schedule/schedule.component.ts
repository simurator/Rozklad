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

  editingLesson: {
    id: number ;
    lesson: Lesson | null;
    dayName: string;
    isEditing: boolean;
    originalLesson: Lesson | null;
    index: number | null;
    teacher: string;
    classroom: string;
    startTime: Date;
    endTime: Date;
    subject: string;
    durationMinutes?: number;
  } = {
      id: 0,
      lesson: null,
      dayName: '',
      isEditing: false,
      originalLesson: null,
      index: null,
      teacher: '',
      classroom: '',
      startTime: new Date(),
      endTime: new Date(),
      subject: '',
    };
  public i: number = 1;
  constructor(private scheduleService: ScheduleService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.schedule = this.scheduleService.getSchedule();
  }
  deleteLesson(dayName: string, lesson: Lesson): void {
    this.scheduleService.deleteLesson(dayName, lesson);
    this.i = this.i + 1;
    
    

  }
  addLesson(dayName: string): void {
    
    
    const day = this.schedule.find(d => d.dayName === dayName);
    
    if (day) {
      const newLesson: Lesson = {
        day: dayName,
        id: this.i + day.lessons.length, // Przypisujemy inkrementalne ID
        subject: '',
        teacher: '',
        classroom: '',
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 0
      };

      day.lessons.push(newLesson);
    }
  }

  startEditing(dayName: string, lesson: Lesson, index: number): void {
    const day = this.schedule.find(d => d.dayName === dayName);
    if (day) {
      const lessonToEdit = day.lessons[index];
      this.editingLesson = {
        id: lessonToEdit.id,
        lesson: { ...lessonToEdit },
        dayName: dayName,
        isEditing: true,
        originalLesson: { ...lessonToEdit },
        index: index,
        teacher: lessonToEdit.teacher,
        classroom: lessonToEdit.classroom,
        startTime: new Date(lessonToEdit.startTime),
        endTime: new Date(lessonToEdit.endTime),
        subject: lessonToEdit.subject,
      };
      
    }
  }

  saveEdit(): void {
    if (!this.editingLesson.lesson || this.editingLesson.index === null) {
      console.error("No lesson to save.");
      return;
    }

    const day = this.schedule.find(d => d.dayName === this.editingLesson.dayName);
    if (!day) {
      console.error("Day not found in the schedule.");
      return;
    }

    // Aktualizacja szczegółów lekcji w wybranym dniu
    const updatedLesson = {
      ...this.editingLesson.lesson,
      id: this.editingLesson.id,
      subject: this.editingLesson.subject,
      teacher: this.editingLesson.teacher,
      classroom: this.editingLesson.classroom,
      startTime: this.editingLesson.startTime,
      endTime: this.editingLesson.endTime
    };

    day.lessons[this.editingLesson.index] = updatedLesson;
    

    this.resetEditingState();
    this.cdr.detectChanges();
  }

  private resetEditingState(): void {
    this.editingLesson = {
      id: 0,
      lesson: null,
      dayName: '',
      isEditing: false,
      originalLesson: null,
      index: null,
      teacher: '',
      classroom: '',
      startTime: new Date(),
      endTime: new Date(),
      subject: '',
    };
  }

  cancelEditing(): void {
    if (this.editingLesson.originalLesson && this.editingLesson.index !== null) {
      const day = this.schedule.find(d => d.dayName === this.editingLesson.dayName);
      if (day) {
        day.lessons[this.editingLesson.index] = { ...this.editingLesson.originalLesson };
      }
    }
    this.resetEditingState();
    this.cdr.detectChanges();
  }

  
}
