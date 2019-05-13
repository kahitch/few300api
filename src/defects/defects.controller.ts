import { DefectRequestWithId } from './DefectRequestWithId';
import { Controller, Get, Post, Put, Body, Res, HttpStatus, Param } from '@nestjs/common';
import { DefectRequest } from './DefectRequest';
import { DefectResponse } from './DefectResponse';
import * as cuid from 'cuid';
import { Response } from 'express';

@Controller('defects')
export class DefectsController {

    database: Defect[] = [
        {
            id: '1', title: 'Title looks awful', dateSubmitted: new Date(2019, 4, 15).toISOString(),
            description: 'There is no formatting or styling of the <p> tag.  We really like yellow, so hop to it!',
            assignedTo: '1', dateFixed: '', commitHashOfFix: '',
        },
        {
            id: '2', title: 'Page never loads data', dateSubmitted: new Date(2019, 4, 26).toISOString(),
            description: 'No matter how long we wait, the data never arrives.  What up with that, yo?!?!',
            assignedTo: '3', dateFixed: new Date().toISOString(), commitHashOfFix: 'eaad2a1bd6c7c03f4fbea0d415a96ea0f493b2d3',
        },
        {
            id: '3', title: 'Viejo wants out of California', dateSubmitted: new Date(2019, 5, 1).toISOString(),
            description: 'Its on a Mission, and its wishin, someone would do somethin bout its Cali condition',
            assignedTo: '', dateFixed: '', commitHashOfFix: '',
        },
    ];

    updateObject: Defect;
    updateObjectIndex: number;
    idCount: number = 3;

    @Get()
    getDefects() {
        return { data: this.database };
    }

    @Post()
    async addDefect(@Body() def: DefectRequest, @Res() res: Response) {
        // await this.delay(5000);
        if (def.title.toLowerCase() === 'darth') {
            res.status(HttpStatus.BAD_REQUEST).send();
        } else {
            // const newId = cuid();
            const response = new DefectResponse();
            // response.id = newId;
            response.id = String(++this.idCount);
            response.title = def.title;
            response.dateSubmitted = new Date().toISOString();
            response.description = def.description;
            response.assignedTo = def.assignedTo;
            response.dateFixed = def.dateFixed;
            response.commitHashOfFix = def.commitHashOfFix;
            this.database.push(response);
            res.status(HttpStatus.CREATED).send(response);
        }

        // function delay(ms: number) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }

    }

    @Put()
    async updateDefect(@Body() def: DefectRequestWithId, @Res() res: Response) {
        if (def.title.toLowerCase() === 'darth') {
            res.status(HttpStatus.BAD_REQUEST).send();
        } else {
            this.updateObject = this.database.find(o => o.id === def.id);
            this.updateObjectIndex = this.database.indexOf(this.updateObject)
            this.database[this.updateObjectIndex] = { ...this.updateObject, ...def };
            res.status(HttpStatus.OK).send(this.database[this.updateObjectIndex]);
        }

    }
}

interface Defect {
    id: string;
    title: string;
    dateSubmitted: string;
    description: string;
    assignedTo: string;
    dateFixed: string;
    commitHashOfFix: string;
}

