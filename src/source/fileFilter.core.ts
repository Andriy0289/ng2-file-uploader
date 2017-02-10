import { DatePipe } from '@angular/common';
import { FileManager } from '../source/fileManager.core';

export enum filterType {
    regex,
    callback
}

export class FileFilter {
    private _name: string = '';
    private _regex: RegExp = null;
    private _regCheck: string = null;
    private _callback: Function = null;
    private _type: filterType = null;

    constructor (name: string, _data: RegExp | Function, _regCheck = 'name') {
        this._name = name;
        if (_data instanceof RegExp) {
            this._type = filterType.regex;
            this._regex = _data;
            this._regCheck = _regCheck;
            return;
        } else if (_data instanceof Function) {
            this._type = filterType.callback;
            this._callback = _data;
            return;
        }
        throw new Error('FilterData is not defined.');
    }

    public get name(): string {
        return this._name;
    }

    public get type(): filterType {
        return this._type;
    }

    public validate(_file: FileManager): boolean {
        let _valid = false;
        switch (this._type) {
            case filterType.regex: {
                switch (this._regCheck) {
                    case 'name': {
                        if (_file.object.name.match(this._regex)) {
                            _valid = true;
                        }
                    }break;

                    case 'type': {
                        if (_file.object.type.match(this._regex)) {
                            _valid = true;
                        }
                    }break;

                    case 'size': {
                        if ((<string><any>_file.object.size).match(this._regex)) {
                            _valid = true;
                        }
                    }break;

                    case 'date': {
                        // Format for validation is `2017-01-01 10:10:10`
                        let _checkDate: string = new DatePipe('en-US').transform(_file.object.lastModifiedDate, 'yyyy-MM-dd hh:mm:ss');
                        if (_checkDate.match(this._regex)) {
                            _valid = true;
                        }
                    }break;

                    default: {
                        throw new Error('RegExp can only check on `name | type | size | date`.');
                    }
                }
            }break;

            case filterType.callback: {
                _valid = this._callback(_file);
            }break;

            default: {
                throw new Error('Filter type is not defined.');
            }
        }
        return _valid;
    }
}
