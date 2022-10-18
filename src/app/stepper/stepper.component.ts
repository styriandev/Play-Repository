import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  @Input() count = 0

  decrement(): void {
    this.count--
  }

  increment(): void {
    this.count++
  }
}
