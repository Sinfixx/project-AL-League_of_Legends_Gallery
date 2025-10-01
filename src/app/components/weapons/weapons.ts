import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message';
import { RouterOutlet, RouterLink } from '@angular/router';
import { WeaponInterface } from '../../../data/weaponInterface';
import { WeaponService } from '../../services/weapons';

@Component({
  selector: 'app-weapons',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './weapons.html',
  styleUrl: './weapons.css',
})
export class Weapons implements OnInit {
  weapons: WeaponInterface[] = [];
  selectedWeapon?: WeaponInterface;

  constructor(private weaponService: WeaponService, private messageService: MessageService) {}

  onSelect(weapon: WeaponInterface): void {
    this.selectedWeapon = weapon;
    this.messageService.add(`WeaponsComponent: Selected weapon id=${weapon.id}`);
  }

  getWeapons(): void {
    this.weaponService.getWeapons().subscribe((weapons) => (this.weapons = weapons));
  }

  ngOnInit(): void {
    this.getWeapons();
  }
}

export class WeaponsComponent {}
