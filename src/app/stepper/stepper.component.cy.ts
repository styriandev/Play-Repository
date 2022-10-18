import { StepperComponent } from './stepper.component'
const counterSelector = '[data-cy=counter]'
describe('StepperComponent', () => {
  it('mounts', () => {
    cy.mount(StepperComponent)
  });
  it('supports an "Input()" count that sets the value', () => {
    // Arrange
    cy.mount('<app-stepper [count]="100"></app-stepper>', {
      declarations: [StepperComponent],
    })
    // Assert
    cy.get(counterSelector).should('have.text', '100')
  });
})
