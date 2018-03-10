import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewprojects',
  templateUrl: './viewprojects.component.html',
  styleUrls: ['./viewprojects.component.scss']
})
export class ViewprojectsComponent implements OnInit {
    simpleSlider = 40;
    doubleSlider = [20, 60];
    state_default: boolean = true;

    constructor() { }

    ngOnInit() {}

}
