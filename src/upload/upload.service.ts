import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  async saveImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadDir = path.join(process.cwd(), 'uploads');
    const savedPaths: string[] = [];

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      try {
        const fileExt = path.extname(file.originalname).toLowerCase();
        // Validate file type
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
          throw new Error(`Invalid file type: ${fileExt}`);
        }

        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);

        // Write file synchronously to ensure completion
        fs.writeFileSync(filePath, file.buffer);
        savedPaths.push(fileName);
      } catch (error) {
        console.error(`Error saving file:`, error);
        throw error;
      }
    }

    return savedPaths;
  }
}
