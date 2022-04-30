import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as jsPDF from "jspdf";
import * as html2pdf from "html2pdf.js";
import * as html2canvas from "html2canvas";
import print from "print-js";
import "@tinymce/tinymce-angular";
import { DocumentsService } from "../documents/documents.service";

@Component({
    selector: "app-text-editor",
    templateUrl: "./text-editor.component.html",
    styleUrls: ["./text-editor.component.scss"]
})
export class TextEditorComponent implements OnInit {
    tinyInit: any;
    teste = "teste";
    @Input()
    dataModel: any;

    @Output()
    dataModelChange = new EventEmitter();

    constructor(private _documentsService: DocumentsService) {}

    ngOnInit() {
        this.tinyInit = {
            // skin_url: "https://atlacontexto.github.io/tinymce4-skins/tundora/",
            selector: "textarea",
            language_url:
                "https://atlacontexto.github.io/tinymce4-i18n/pt_BR.js",
            language: "pt_BR",
            spellchecker_language: "pt_BR",

            menubar: false,
            height: "97%",
            plugins:
                "spellchecker, toc, table, print, preview, image, imagetools, link, autolink, lists, advlist, charmap, wordcount, autoresize, fullscreen, textcolor, colorpicker, hr",
            toolbar: [
                "undo redo exportPdfButton print | fontselect fontsizeselect | bold italic underline forecolor backcolor",
                "alignleft aligncenter alignright alignjustify | indent outdent | toc table | numlist bullist | list | charmap link image | preview fullscreen"
            ],
            table_toolbar:
                "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
            lists_ident_on_tab: true,
            autoresize_max_height: 560,
            autoresize_min_height: 560,
            autoresize_bottom_margin: 50,
            branding: false,
            elementpath: false,
            resize: false,
            image_advtab: true,
            content_css:
                "https://atlacontexto.github.io/tinymce4-css/content.css",
            setup: editor => {
                function exportToPdf(e) {
                    const htmlContent =
                        e.currentTarget.ownerDocument.activeElement
                            .contentDocument;

                    if (htmlContent) {
                        const date = new Date();

                        const opt = {
                            margin: 1,
                            filename: `PlanejamentoDiario_${date.getDate()}-${date.getMonth() +
                                1}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.pdf`,
                            image: { type: "jpeg", quality: 0.98 },
                            html2canvas: { scale: 2 },
                            letterRendering: true,
                            proxy: window.location.hostname,
                            allowTaint: true,
                            useCORS: true,
                            imageTimeout: 0,
                            jsPDF: {
                                unit: "in",
                                format: "letter",
                                orientation: "portrait"
                            }
                        };
                        html2pdf()
                            .from(htmlContent.activeElement.innerHTML)
                            .set(opt)
                            .save();
                    } else {
                        editor.notificationManager.open({
                            text:
                                "Clique no campo de edição e novamente no botão baixar!",
                            type: "info"
                        });
                    }
                }

                editor.on("init", function(e) {
                    console.log("Editor was initialized.");
                });

                editor.addButton("exportPdfButton", {
                    text: "Baixar",
                    icon: "save",
                    tooltip: "Baixar como PDF",
                    onclick: exportToPdf
                });
            },
            images_upload_handler: function(blobInfo, success, failure) {
                const formData = new FormData();
                formData.append("Blob", blobInfo.blob());
                formData.append("Base64", blobInfo.base64());

                success(
                    `data:${formData.get("Blob")["type"]};base64,${formData.get(
                        "Base64"
                    )}`
                );
            }
        };
    }

    contentChange(value) {
        this.dataModel = value;
        this.dataModelChange.emit(this.dataModel);
    }
}
