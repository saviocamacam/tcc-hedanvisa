import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmailValidationComponent } from "./email-validation/email-validation.component";
import { FuseProgressBarModule } from "@fuse/components/progress-bar/progress-bar.module";

@NgModule({
    declarations: [EmailValidationComponent],
    imports: [CommonModule, FuseProgressBarModule],
    exports: [EmailValidationComponent]
})
export class ValidationsModule {}
