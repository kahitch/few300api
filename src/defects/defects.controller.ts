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

    @Get()
    getDefects() {
        return { data: this.database };
    }

    @Post()
    async addDefect(@Body() def: DefectRequest, @Res() res: Response) {
        if (def.title.toLowerCase() === 'darth') {
            res.status(HttpStatus.BAD_REQUEST).send();
        } else {
            const newId = cuid();
            const response = new DefectResponse();
            response.id = newId;
            response.title = def.title;
            response.dateSubmitted = new Date().toISOString();
            response.description = def.description;
            response.assignedTo = def.assignedTo;
            response.dateFixed = def.dateFixed;
            response.commitHashOfFix = def.commitHashOfFix;
            this.database.push(response);
            res.status(HttpStatus.CREATED).send(response);
        }
    }

    @Put(':id')
    async updateDefect(@Param('id') id: string, @Body() def: DefectRequest, @Res() res: Response) {
        if (def.title.toLowerCase() === 'darth') {
            res.status(HttpStatus.BAD_REQUEST).send();
        } else {
            this.updateObject = this.database.find(o => o.id === id);
            this.updateObject = { ...this.updateObject, ...def };
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

