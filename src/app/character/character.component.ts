import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {Character} from '../classes/character';
import { Class } from '../classes/class.enum';


@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {
  characterForm: FormGroup;

  state: String;
  character: Character;

  constructor(private fb: FormBuilder) {
    this.character = new Character();
    this.character.name = 'Windstorm';
    this.character.experience = 400;
    this.character.class = Class.Cragheart;
    this.createForm();
    this.state = '';
  }

  createForm() {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      level: [1, Validators.max(9)],
      experience: 0,
      class: null
    });
  }

  ngOnInit() {
    this.characterForm.setValue({
      name: this.character.name,
      level: this.character.level,
      experience: this.character.experience,
      class: this.character.class
    });
  }

  onEdit() {
    this.state = ' EDIT ';
  }

}
