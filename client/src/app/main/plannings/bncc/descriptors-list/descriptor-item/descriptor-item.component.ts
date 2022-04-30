import {
    Component,
    OnInit,
    EventEmitter,
    AfterContentInit,
    OnDestroy,
    Output,
    Input,
    HostBinding
} from "@angular/core";
import { Subject } from "rxjs";
import { QuestionsDatabaseService } from "app/main/questions-database/questions-database.service";
import { fuseAnimations } from "@fuse/animations";
import { takeUntil, filter } from "rxjs/operators";

@Component({
    selector: "app-descriptor-item",
    templateUrl: "./descriptor-item.component.html",
    styleUrls: ["./descriptor-item.component.scss"],
    animations: fuseAnimations
})
export class DescriptorItemComponent implements OnInit, OnDestroy {
    @Output() itemSelected = new EventEmitter();
    @Input() descriptor: any;
    @HostBinding("class.selected")
    selected: boolean;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(private _questionDatabaseService: QuestionsDatabaseService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        console.log(this.descriptor);
        this._questionDatabaseService.onQuestionChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(question => question != null)
            )
            .subscribe(question => {
                if (
                    question.meta &&
                    question.meta.descriptors &&
                    question.meta.descriptors.includes(this.descriptor.codigo)
                ) {
                    this.descriptor.check = true;
                }
                console.log(this.descriptor);
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSelectedChange(): void {
        this.itemSelected.emit(this.descriptor);
    }
}
