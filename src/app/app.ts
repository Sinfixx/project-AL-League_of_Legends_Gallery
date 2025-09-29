import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Heroes } from './components/heroes/heroes';
import { Messages } from './components/messages/messages';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Heroes, Messages],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = 'Heroes Galery';
}
