import { Toolbar, ToolbarWidget, ToolbarWidgetGroup } from '@angular/aria/toolbar';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxsFormDirective } from '@ngxs/form-plugin';
import { RxLet } from '@rx-angular/template/let';

import { InputFieldComponent } from '$components/input-field';
import { HomeFacade } from '$domains/home';
import { ButtonDirective } from '$shared/ui/button';
import { InputDirective } from '$shared/ui/input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxsFormDirective,
    RxLet,
    ButtonDirective,
    InputDirective,
    InputFieldComponent,
    Toolbar,
    ToolbarWidget,
    ToolbarWidgetGroup,
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly facade = inject(HomeFacade);

  readonly count$ = this.facade.count$;
  readonly textFormModel$ = this.facade.textFormModel$;
  readonly textFormStatus$ = this.facade.textFormStatus$;

  /** Toolbar alignment selection */
  readonly alignment = signal<string[]>(['left']);

  /** Reactive form for text input */
  readonly textForm = new FormGroup({
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
  });

  /** Check if text field has errors and has been touched */
  get isTextInvalid(): boolean {
    const control = this.textForm.controls.text;
    return control.invalid && (control.dirty || control.touched);
  }

  increment(): void {
    this.facade.increment();
  }
}
