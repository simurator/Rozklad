import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Lesson } from '../../models/lesson.model';
import { Day } from '../../models/day.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lessonTimeValidator } from '../../validators/lesson-time.validator';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ScheduleComponent implements OnInit {
  schedule: Day[] = [];
  editForms: { [key: string]: { [key: number]: FormGroup } } = {};

  constructor(
    private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.schedule = this.scheduleService.getSchedule();
    this.initEditForms();
  }

  private initEditForms(): void {
    this.editForms = {};

    this.schedule.forEach(day => {
      this.editForms[day.dayName] = {};

      day.lessons.forEach((lesson, index) => {
        this.editForms[day.dayName][index] = this.createLessonForm(lesson);
      });
    });
  }

  private createLessonForm(lesson: Lesson): FormGroup {
    return this.fb.group({
      id: [lesson.id],
      subject: [lesson.subject, Validators.required],
      teacher: [lesson.teacher, Validators.required],
      classroom: [lesson.classroom, Validators.required],
      startTime: [lesson.startTime, Validators.required],
      endTime: [lesson.endTime, Validators.required],
      editing: [false] // Pole kontrolujące tryb edycji
    }, { validators: lessonTimeValidator() });
  }

  deleteLesson(dayName: string, lesson: Lesson): void {
    this.scheduleService.deleteLesson(dayName, lesson);
    this.schedule = this.scheduleService.getSchedule();
    this.initEditForms();
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
        endTime: new Date()
        
      };

      this.scheduleService.addLesson(dayName, newLesson);
      this.schedule = this.scheduleService.getSchedule();
      this.initEditForms();
    }
  }

  saveEdit(dayName: string, lessonIndex: number): void {
    const form = this.editForms[dayName][lessonIndex];

    if (form.valid) {
      const lesson = form.value;
      this.scheduleService.updateLesson(dayName, lesson);

      // Completely reset the form for this lesson
      this.editForms[dayName][lessonIndex] = this.createLessonForm(lesson);

      // Trigger change detection to update the view
      this.cdr.detectChanges();
    } else {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  

  enableEditing(dayName: string, lessonIndex: number): void {
    // Disable editing for all lessons in this day
    Object.keys(this.editForms[dayName]).forEach((index) => {
      const form = this.editForms[dayName][Number(index)];
      form.get('editing')?.setValue(false);
    });

    // Enable editing for the selected lesson
    this.editForms[dayName][lessonIndex].get('editing')?.setValue(true);
  }




  cancelEditing(dayName: string, lessonIndex: number): void {
    const originalLesson = this.schedule.find(d => d.dayName === dayName)?.lessons[lessonIndex];
    if (originalLesson) {
      this.editForms[dayName][lessonIndex] = this.createLessonForm(originalLesson);
      this.editForms[dayName][lessonIndex].get('editing')?.setValue(false); // Wyłącz tryb edycji
      this.cdr.markForCheck();
    }
  }

  isControlInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${controlName} is required`;
      }
    }
    return '';
  }
}
