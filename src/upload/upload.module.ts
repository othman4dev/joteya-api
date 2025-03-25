import { Module } from '@nestjs/common';
import { FileUploadService } from './upload.service';

@Module({
  providers: [FileUploadService],
  exports: [FileUploadService], // Export the service so other modules can use it
})
export class UploadModule {}
