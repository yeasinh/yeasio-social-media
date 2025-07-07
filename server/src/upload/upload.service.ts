import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

@Injectable()
export class UploadService {
  async saveFile(file: FileUpload): Promise<string> {
    const { createReadStream, filename, mimetype } = file;

    const folder = join(__dirname, '..', '..', 'uploads');
    if (!existsSync(folder)) mkdirSync(folder);

    const ext = filename.split('.').pop();
    const newName = `${uuid()}.${ext}`;
    const path = join(folder, newName);
    const stream = createReadStream();

    await new Promise<void>((resolve, reject) => {
      const write = createWriteStream(path);
      stream.pipe(write);
      write.on('finish', () => resolve());
      write.on('error', reject);
    });

    return `/uploads/${newName}`;
  }
}
