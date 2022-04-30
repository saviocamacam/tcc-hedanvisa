import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { MatDialogModule, MatButtonModule } from "@angular/material";

@NgModule({
    declarations: [TermsAndConditionsComponent],
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    exports: [TermsAndConditionsComponent],
    entryComponents: [TermsAndConditionsComponent]
})
export class TermsModule {}
