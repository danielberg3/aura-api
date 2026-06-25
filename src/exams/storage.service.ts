import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class R2File {
  originalname!: string;
  buffer!: Buffer;
  mimetype!: string;
}

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor() {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '';
    this.publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? '';

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId ?? '',
        secretAccessKey: secretAccessKey ?? '',
      },
    });
  }

  async uploadFile(file: R2File, folder = 'exams'): Promise<string> {
    const fileExtension = file.originalname.split('.').pop() ?? 'jpg';
    const uniqueFileName = `${folder}/${Date.now()}-${Math.floor(
      Math.random() * 1000000,
    )}.${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Ensure there is no trailing slash on publicUrl
    const baseUrl = this.publicUrl.endsWith('/')
      ? this.publicUrl.slice(0, -1)
      : this.publicUrl;

    return `${baseUrl}/${uniqueFileName}`;
  }
}
