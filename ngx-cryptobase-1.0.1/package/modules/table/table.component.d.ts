import { OnInit } from '@angular/core';
import { TableConfig } from './models/table-config';
import { PagerService } from "./services/pager.service";
export declare class TableComponent implements OnInit {
    private pagerService;
    config: TableConfig;
    sortField: string;
    order: string;
    pager: any;
    allItems: any[];
    constructor(pagerService: PagerService);
    ngOnInit(): void;
    mySorting(field: any): void;
    setPage(page: number): void;
    sort(): any[];
}
