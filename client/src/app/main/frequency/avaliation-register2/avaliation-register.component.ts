import { Component, Input, OnInit } from '@angular/core';
import { TableControl } from '../TableControl';

const sum = (array: Array<any>, acessor: Function) => array.reduce((prev, next) => prev + acessor(next), 0)
const unwind = (array: Array<any>, accessor: Function) => array
    .reduce((previus: any, current: any) =>
    ({
        ...previus,
        [`${accessor(current)}`]: current,
    })
    , { length: array.length });

@Component({
    selector: 'app-avaliation-register2',
    templateUrl: './avaliation-register.component.html',
    styleUrls: ['./avaliation-register.component.scss']
})
export class AvaliationRegisterComponent2 implements OnInit {
    @Input() tableControl: TableControl;

    matrixes: Array<any>;
    students: Array<any>;
    data: Array<any>;

    constructor() {
        this.matrixes = [
            {
                valuations: [
                    {
                        id: "1.1",
                        label: 'N1',
                        weight: 3,
                        assigned: true,
                    },
                    {
                        id: "1.2",
                        label: 'N2',
                        weight: 3,
                        assigned: true,
                    },
                    {
                        id: "1.3",
                        label: 'N3',
                        weight: 4,
                        assigned: false,
                    },
                ],
                recoverys: [
                    {
                        id: "2.1",
                        label: 'R1',
                        ref: [ '1.1', '1.2' ],
                        assigned: true,
                    },
                    {
                        id: "2.2",
                        label: 'R2',
                        ref: [ '1.3' ],
                        assigned: false,
                    },
                ],
                discipline: {
                    id: '1',
                    label: 'Português',
                },
                medias: [
                    {
                        label: 'MN',
                    },
                    {
                        label: 'MR',
                    },
                    {
                        label: 'MF',
                    }
                ]
            },
            {
                valuations: [
                    {
                        id: "1.1",
                        label: 'N1',
                        weight: 3,
                        assigned: true,
                    },
                    {
                        id: "1.2",
                        label: 'N2',
                        weight: 3,
                        assigned: true,
                    },
                    {
                        id: "1.3",
                        label: 'N3',
                        weight: 4,
                        assigned: false,
                    },
                ],
                recoverys: [
                    {
                        id: "2.1",
                        label: 'R1',
                        ref: [ '1.1', '1.2' ],
                        assigned: true,
                    },
                    {
                        id: "2.2",
                        label: 'R2',
                        ref: [ '1.3' ],
                        assigned: false,
                    },
                ],
                discipline: {
                    id: '2',
                    label: 'Matemática',
                },
                medias: [
                    {
                        label: 'MN',
                    },
                    {
                        label: 'MR',
                    },
                    {
                        label: 'MF',
                    },
                ],
            },
            {
                valuations: [
                    {
                        id: "1.1",
                        label: 'N1',
                        weight: 3,
                        assigned: true,
                    },
                    {
                        id: "1.2",
                        label: 'N2',
                        weight: 3,
                        assigned: true,
                    },
                    {
                        id: "1.3",
                        label: 'N3',
                        weight: 4,
                        assigned: false,
                    },
                ],
                recoverys: [
                    {
                        id: "2.1",
                        label: 'R1',
                        ref: [ '1.1', '1.2' ],
                        assigned: true,
                    },
                    {
                        id: "2.2",
                        label: 'R2',
                        ref: [ '1.3' ],
                        assigned: false,
                    },
                ],
                discipline: {
                    id: '3',
                    label: 'Ciências',
                },
                medias: [
                    {
                        label: 'MN',
                    },
                    {
                        label: 'MR',
                    },
                    {
                        label: 'MF',
                    }
                ],
            }
        ];
        this.students = [
            {
                no: 1,
                name: 'pedro',
                '1': {
                    '1.1': {
                        score: 1.3,
                    },
                    'miss': 5
                }
            },
            {
                no: 3,
                name: 'jao',
                '1': {
                    '1.1': {
                        score: 2.4,
                    },
                    '1.3': {
                        score: 2,
                    }
                }
            },
            {
                no: 2,
                name: 'luca',
                '1': {
                    '1.1': {
                        score: 1.6,
                    },
                    '1.2': {
                        score: 2.4,
                    }
                }
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
        ];
        
        this.format();
    }
    ngOnInit() {
    }

    format() {
        const students = this.students.sort((student1, student2) => (student1.no > student2.no) ? 1 : 0);
        this.students = students;

        this.data = this.matrixes
            .map(item => 
                ({
                    id: item['discipline']['id'],
                    label: item['discipline']['label'],
                    valuations: unwind(item['valuations'], ((obj: any) => obj["id"])),
                    recoverys: item['recoverys'],
                    medias: item['medias'],
                })
            ).map(item =>
                ({
                    ...item,
                    recoverys: item['recoverys'].map(rec => 
                        ({
                            ...rec,
                            ref: rec['ref']
                                .map((ref: any) => item['valuations'][ref]),
                            weight: sum(rec['ref'], (ref: any) => item['valuations'][ref]['weight']),
                        })
                    ),
                })
            ).map(item =>
                ({
                    ...item,
                    recoverys: unwind(item['recoverys'], ((obj: any) => obj["id"]))
                })
            );
    }

    getScore(student: any, matrix: any, avaliation: any) {
        const disc = student[matrix['id']];
        
        if (!disc)
            return null;
        
        const evaluation = disc[avaliation];

        if (!evaluation)
            return null;

        return evaluation.score;
    }

    keys(obj: any) {
        return Object.keys(obj).filter(item => item !== 'length');
    }

    empty(obj: any) {
        return (Object.keys(obj).length > 0);
    }
}
