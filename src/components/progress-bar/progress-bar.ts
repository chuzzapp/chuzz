import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress = 0;
  @Input('bar-color') barColor;
  @Input('group') group: boolean = false;
  barColorComplete: string;
  barColorOuter: string;

  constructor() {
    console.log('Hello ProgressBarComponent Component');

  }

  ngOnInit() {
    this.updateBarColor();
  }

  hex2rgb(hex, opacity) {
    var h = hex.replace('#', '');
    h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));

    for (var i = 0; i < h.length; i++)
      h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);

    if (typeof opacity != 'undefined') h.push(opacity);

    return 'rgba(' + h.join(',') + ')';
  }

  ngOnChanges() {
    this.updateBarColor();
  }

  private updateBarColor() {
    if (!this.barColor) {
      if (this.progress >= 0.5) {
        this.barColorComplete = 'rgb(255,87,34)';
        this.barColorOuter = 'rgba(255,87,34, 0.5)';
      } else {
        this.barColorComplete = 'rgb(255,255,255)';
        this.barColorOuter = 'rgba(255,255,255, 0.5)';
      }
    } else {
      this.barColorComplete = this.barColor;
      this.barColorOuter = this.hex2rgb(this.barColor, 0.5);
    }
  }
}
