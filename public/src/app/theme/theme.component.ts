import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss']
})

export class ThemeComponent implements OnInit {
    model = {
        left: true,
        middle: false,
        right: false
    };
    constructor() { }

    ngOnInit() {}
}
