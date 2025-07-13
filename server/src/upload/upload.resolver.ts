import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { GraphQLUpload } from 'graphql-upload';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    return this.uploadService.saveFile(file);
  }
}
