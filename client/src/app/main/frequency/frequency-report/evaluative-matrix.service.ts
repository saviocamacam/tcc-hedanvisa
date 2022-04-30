import { FrequencyService } from "./../frequency.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class EvaluativeMatrixService {
    private matrixes;

    constructor(private _frequencyService: FrequencyService) {}

    getEvaluativeMatrixes(classroomId, periodId) {
        return new Promise((resolve, reject) => {
            console.log(classroomId, periodId);
            this._frequencyService
                .getMatrixes(classroomId, periodId)
                .then(async matrixes => {
                    this.matrixes = matrixes.data;
                    await this.createAvaliation();
                    resolve(this.matrixes);
                })
                .catch(error => reject(error));
        });
    }
    async createAvaliation() {
        for (let im = 0; im < this.matrixes.length; im++) {
            const m = this.matrixes[im];
            await Promise.all([
                ...m.valuations.map(async (v, iv) => {
                    const valuation = await this._frequencyService
                        .getEnrollmentValuation(v._id);
                    this.matrixes[im].valuations[iv].values = valuation.data;
                }),
                ...m.recoveries.map(async (r, ir) => {
                    const recovery = await this._frequencyService
                        .getEnrollmentValuation(r._id);
                    this.matrixes[im].recoveries[ir].values = recovery.data;
                })
            ])
        }
    }
}
