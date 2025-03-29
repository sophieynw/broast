import { Component, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-bear',
  imports: [],
  templateUrl: './bear.component.html',
  styleUrl: './bear.component.css'
})
export class BearComponent {
  constructor(private elementRef: ElementRef<HTMLElement>) {

  }
  mouseX!: number;
  mouseY!: number;
  anchorX!: number;
  anchorY!: number;

  ngOnInit() {
    const anchorElement = document.getElementById("bear-anchor");

    const rect = anchorElement?.getBoundingClientRect();

    if (rect  !== undefined) {
      this.anchorX = rect.top + rect.width / 2;
      this.anchorY = rect.top + rect.height / 2;
    } else {
      console.error('Unable to retrieve a DOM');
    }
    console.log(rect);
  }

  // Calculate the ang;e from the center of the anchor element to the mouse location
  calc_angle_deg(cx: number, cy: number, ex: number, ey: number) {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    const deg = rad * 180 / Math.PI;
    return deg;
  }


  // Add event listener for mouse movement
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Get mouse coordinates
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    // Get angle in degrees
    const angleDeg = this.calc_angle_deg(this.mouseX, this.mouseY, this.anchorX, this.anchorY);

    this.movePupils(angleDeg);

  }

  movePupils(angleDeg:number)
  {
    const pupils = document.querySelectorAll('.pupil');
    const maxMovementX = 20;

    pupils.forEach((pupil: Element) => {
      // Allow move the pupils nly on the X-axis
      const movementX = Math.min(Math.max((this.mouseX - this.anchorX) / 10, -maxMovementX), maxMovementX);
      (pupil as HTMLElement).style.transform = `translateX(${movementX}px)`; 
    });
  }



}
