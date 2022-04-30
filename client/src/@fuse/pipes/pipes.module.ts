import { NgModule } from "@angular/core";

import { KeysPipe, DefaultKeysPipe } from "./keys.pipe";
import { GetByIdPipe, GetElementByIdUnderscorePipe } from "./getById.pipe";
import { GetElementByIdPipe } from "./getById.pipe";
import { HtmlToPlaintextPipe } from "./htmlToPlaintext.pipe";
import { FilterPipe } from "./filter.pipe";
import { CamelCaseToDashPipe } from "./camelCaseToDash.pipe";

@NgModule({
    declarations: [
        KeysPipe,
        DefaultKeysPipe,
        GetByIdPipe,
        GetElementByIdPipe,
        GetElementByIdUnderscorePipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe
    ],
    imports: [],
    exports: [
        KeysPipe,
        DefaultKeysPipe,
        GetByIdPipe,
        GetElementByIdPipe,
        GetElementByIdUnderscorePipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe
    ]
})
export class FusePipesModule {}
