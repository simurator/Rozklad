import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule, FormsModule]  // Add FormsModule to imports
})
export class ScheduleComponent implements OnInit {
  schedule: Day[] = [];
  editingLesson: {
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
  } = {
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

  constructor(private scheduleService: ScheduleService) { }

  // Compare lessons to check if they're the same
  compareLessons(lesson1: Lesson, lesson2: Lesson): boolean {
    return lesson1.subject === lesson2.subject &&
      lesson1.teacher === lesson2.teacher &&
      lesson1.startTime === lesson2.startTime &&
      lesson1.endTime === lesson2.endTime;
  }

  // Initialize schedule data
  ngOnInit(): void {
    this.schedule = this.scheduleService.getSchedule();
  }

  // Add a new lesson
  addLesson(dayName: string): void {
    const newLesson: Lesson = {
      subject: 'New Lesson',
      teacher: 'New Teacher',
      classroom: 'New Classroom',
      startTime: new Date(),
      endTime: new Date(),
      day: dayName
    };
    this.scheduleService.addLesson(dayName, newLesson);
  }

  // Delete a lesson
  deleteLesson(dayName: string, lesson: Lesson): void {
    this.scheduleService.deleteLesson(dayName, lesson);
  }

  // Start editing a lesson
  startEditing(dayName: string, lesson: Lesson, index: number): void {
    const day = this.schedule.find(d => d.dayName === dayName);
    if (day) {
      const lessonToEdit = day.lessons[index];
      this.editingLesson = {
        lesson: { ...lessonToEdit }, // Copy lesson to preserve existing data
        dayName: dayName,
        isEditing: true,
        originalLesson: lessonToEdit,
        index: index,
        teacher: lessonToEdit.teacher,  // Set teacher
        classroom: lessonToEdit.classroom,  // Set classroom
        startTime: new Date(lessonToEdit.startTime),  // Set start time
        endTime: new Date(lessonToEdit.endTime),  // Set end time
        subject: lessonToEdit.subject, // Ensure subject is set here
      };
    }
  }


  // Save the edited lesson
  saveEdit(): void {
    // Check if the lesson and index are valid
    if (!this.editingLesson.lesson || this.editingLesson.index === null || this.editingLesson.index === undefined) {
      console.error("No lesson to save.");
      return;
    }

    // Log the current state for debugging purposes
    console.log("Saving lesson:", this.editingLesson);

    // Find the day object by its name
    const day = this.schedule.find(d => d.dayName === this.editingLesson.dayName);

    if (!day) {
      console.error("Day not found in the schedule.");
      return;
    }

    // Update the lesson in the schedule using the lesson from editingLesson
    day.lessons[this.editingLesson.index] = {
      ...this.editingLesson.lesson,    // Spread the original lesson to retain unchanged properties
      subject: this.editingLesson.subject, // Ensure subject is correctly set
      teacher: this.editingLesson.teacher,  // Update teacher
      classroom: this.editingLesson.classroom,  // Update classroom
      startTime: this.editingLesson.startTime,  // Update start time
      endTime: this.editingLesson.endTime   // Update end time
    };

    // Log the updated lesson for debugging
    console.log("Updated lesson:", day.lessons[this.editingLesson.index]);

    // Reset the editing state after saving
     // Call the cancel function to clear the editing state
  }


  // Cancel editing and reset the form
  cancelEditing(): void {
    if (this.editingLesson.originalLesson) {
      // Restore the original lesson
      const day = this.schedule.find(d => d.dayName === this.editingLesson.dayName);
      if (day && this.editingLesson.index !== null) {
        day.lessons[this.editingLesson.index] = this.editingLesson.originalLesson;
      }
    }

    // Reset the state of editingLesson
    this.editingLesson = {
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
}
