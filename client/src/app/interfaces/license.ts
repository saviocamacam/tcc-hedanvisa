export class License {
    _id: string;
    viewValue: string;
    description: string;
    link: string;

    constructor(
        _id: string,
        description: string,
        link: string,
        viewValue: string
    ) {
        this._id = _id;
        this.viewValue = viewValue;
        this.description = description;
        this.link = link;
    }
}
