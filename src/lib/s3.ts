import { nanoid } from 'nanoid';

import {
    ObjectCannedACL,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadToS3 = async (file: File): Promise<string> => {
    const fileName = `icons/${nanoid()}-${file.name}`;
    const fileArrayBuffer = await file.arrayBuffer();

    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: fileName,
        Body: new Uint8Array(fileArrayBuffer),
        ContentType: file.type,
        ACL: ObjectCannedACL.public_read_write,
    };

    try {
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);

        return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('S3 upload failed');
    }
};
