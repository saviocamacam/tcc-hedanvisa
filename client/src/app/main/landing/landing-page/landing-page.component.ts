import { Component, OnInit } from "@angular/core";
import { FuseConfigService } from "@fuse/services/config.service";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"]
})
export class LandingPageComponent implements OnInit {

  constructor(private _fuseConfigService: FuseConfigService) {
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        }
      }
    };
  }

  ngOnInit() {
  }

}
