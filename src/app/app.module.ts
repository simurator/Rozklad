import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';    // Główny komponent aplikacji
import { ScheduleComponent } from './components/schedule/schedule.component';
import { DayComponent } from './components/day/day.component';
import { LessonComponent } from './components/lesson/lesson.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ScheduleService } from './services/schedule.service';


@NgModule({
  declarations: [
    AppComponent,          // Główny komponent aplikacji
    ScheduleComponent,     // Komponent zarządzający harmonogramem
    DayComponent,          // Komponent dnia tygodnia
    LessonComponent        // Komponent lekcji
  ],
  imports: [
    HttpClientModule,
    BrowserModule          // Moduł wymagany dla aplikacji Angular
  ],
  providers: [ScheduleService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  // Główny komponent uruchamiany jako pierwszy
})
export class AppModule { }
