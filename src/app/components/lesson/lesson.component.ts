import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-lesson',
  standalone: true,
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent {
  @Input() lesson !: Lesson;
  @Output() onEdit = new EventEmitter<Lesson>();
  @Output() onDelete = new EventEmitter<Lesson>();
  constructor() {
    // Można dodać logikę, która będzie uruchamiana przy tworzeniu komponentu
    
  }
  editLesson() {
    this.onEdit.emit(this.lesson);
  }

  deleteLesson() {
    this.onDelete.emit(this.lesson);
  }
}
