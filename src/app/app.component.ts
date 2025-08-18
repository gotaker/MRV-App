import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
@Component({ selector: 'app-root', standalone: true, imports: [RouterOutlet, ShellComponent], template: `<app-shell/>` })
export class AppComponent {}
