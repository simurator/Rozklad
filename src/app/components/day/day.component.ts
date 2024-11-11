import { Component, Input, OnInit } from '@angular/core';
import { Schedule, Day } from '../../models/schedule.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent {
  @Input() day!: Day;  // Przyjmowanie obiektu dnia typu Day

  constructor() { }
}
