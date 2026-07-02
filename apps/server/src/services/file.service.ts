import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

export class FileService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(env.UPLOAD_DIR);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  deleteFile(filename: string): void {
    const filePath = this.getFilePath(filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  generateSubPath(subDir: string): string {
    const dir = path.join(this.uploadDir, subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }
}
