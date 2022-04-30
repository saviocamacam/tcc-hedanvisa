import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { CountySchoolsModule } from "./county-schools/county-schools.module";
import { CountiesComponent } from "./counties/counties.component";

@NgModule({
    imports: [CommonModule, CountySchoolsModule],
    declarations: [CountiesComponent],
    entryComponents: []
})
export class CountyModule {}
