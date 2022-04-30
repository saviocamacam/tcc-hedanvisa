import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-school-courses",
  templateUrl: "./school-courses.component.html",
  styleUrls: ["./school-courses.component.scss"]
})
export class SchoolCoursesComponent implements OnInit, OnDestroy {

  constructor() {
    console.log("Hello World SchoolCoursesComponent");
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log("SchoolCoursesComponent has destroyed.");
  }

}
