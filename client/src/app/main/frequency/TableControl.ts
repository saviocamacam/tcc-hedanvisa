import { MatTableDataSource } from '@angular/material';

export interface Collumn {
    name: string;
    label: string;
}

export class TableControl {
    // Controle da tabela
    public displayedColumns: string[];
    public dataSource: MatTableDataSource<any>;
    public columns: Collumn[] = [];
    public table: any[] = [];

    public spans = [];
    public displayedSpans: string[];

    constructor() {}

    create() {
        try {
            // Definindo a saída, como feito no exemplo seguido da web.
            this.displayedColumns = this.columns.map(column => column.name);
            this.dataSource = new MatTableDataSource<any>(this.table);
        } catch(e) {
            console.log(e);
        }
    }

    addBlankColumnsUntil(n) {
        const blankValue = " ";
        for (let i = this.columns.length; i < n; i++) {
            this.columns.push({ name: `blank${i}`, label: blankValue });
        }
    }

    isSpanning(key) {
        return this.displayedColumns.includes(key);
    }

    getRowSpan(col, index) {
        return this.spans[index] && this.spans[index][col];
    }

    cacheSpan(key, accessor) {
        for (let i = 0; i < this.table.length;) {
            let currentValue = accessor(this.table[i]);
            let count = 1;

            for (let j = i + 1; j < this.table.length; j++) {
                if (currentValue != accessor(this.table[j])) {
                    break;
                }

                count++;
            }

            if (!this.spans[i]) {
                this.spans[i] = {};
            }

            this.spans[i][key] = count;
            i += count;
        }
    }
}
