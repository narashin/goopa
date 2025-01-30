import { v4 as uuidv4 } from 'uuid';

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

console.log('AWS_REGION:', process.env.AWS_REGION);

export const uploadToS3 = async (file: File): Promise<string> => {
    const fileName = `icons/${uuidv4()}-${file.name}`;
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: fileName,
        Body: file.stream(),
        ContentType: file.type,
        ACL: ObjectCannedACL.public_read,
    };

    try {
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);
        console.log('File uploaded successfully', data);
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`; // S3 URL 반환
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('S3 upload failed');
    }
};
