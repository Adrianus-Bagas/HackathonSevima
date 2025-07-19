import { PassThrough } from 'stream';
import * as fileType from 'file-type';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { Workbook } from 'exceljs';
import { createParserCsvOrXlsx } from './parseCSV';

const ALLOWED_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'text/comma-separated-values',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
] as const;

export class CsvOrXlsxMulterEngine {
  private destKey: string;
  private maxFileSize: number;
  constructor(opts: { destKey: string; maxFileSize: number }) {
    this.destKey = opts.destKey;
    this.maxFileSize = opts.maxFileSize;
  }
  async _handleFile(req: Request, file: any, cb: any) {
    try {
      const contentLength = Number(req.headers['content-length']);
      if (
        typeof contentLength === 'number' &&
        contentLength > this.maxFileSize
      ) {
        throw new Error(`Max file size is ${this.maxFileSize} bytes.`);
      }
      const fileStream = await fileType.fileTypeStream(file.stream);
      const mime = fileStream.fileType?.mime ?? file.mimetype;
      if (!ALLOWED_MIME_TYPES.includes(mime)) {
        throw new BadRequestException('File must be *.csv or *.xlsx');
      }
      const replacementStream = new PassThrough();
      fileStream.pipe(replacementStream);
      const parser = createParserCsvOrXlsx(mime);
      const data = await parser.read(replacementStream);
      cb(null, {
        [this.destKey]:
          mime === 'text/csv' ? data : (data as Workbook).getWorksheet(),
      });
    } catch (error) {
      cb(error);
    }
  }
  _removeFile(req: Request, file: any, cb: any) {
    cb(null);
  }
}