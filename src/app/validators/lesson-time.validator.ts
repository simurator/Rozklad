import { AbstractControl, ValidatorFn } from '@angular/forms';

export function lessonTimeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const startTime = control.get('startTime');
    const endTime = control.get('endTime');

    if (!startTime || !endTime) {
      return null;
    }

    const startTimeValue = startTime.value instanceof Date
      ? startTime.value.getTime()
      : new Date(startTime.value).getTime();

    const endTimeValue = endTime.value instanceof Date
      ? endTime.value.getTime()
      : new Date(endTime.value).getTime();

    return startTimeValue < endTimeValue
      ? null
      : { 'invalidLessonTime': { startTime: startTime.value, endTime: endTime.value } };
  };
}
