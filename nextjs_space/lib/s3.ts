import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client, getBucketConfig } from "./aws-config";

const client = createS3Client();
const { bucketName, folderPrefix } = getBucketConfig();

export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  isPublic: boolean = false
): Promise<{ uploadUrl: string; cloud_storage_path: string }> {
  try {
    const timestamp = Date.now();
    const cloud_storage_path = isPublic
      ? `${folderPrefix}public/uploads/${timestamp}-${fileName}`
      : `${folderPrefix}uploads/${timestamp}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: cloud_storage_path,
      ContentType: contentType
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    return { uploadUrl, cloud_storage_path };
  } catch (error) {
    console.error("Error generating presigned upload URL:", error);
    throw error;
  }
}

export async function getFileUrl(
  cloud_storage_path: string,
  isPublic: boolean = false
): Promise<string> {
  try {
    if (isPublic) {
      const region = process.env.AWS_REGION ?? "us-east-1";
      return `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
    } else {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: cloud_storage_path
      });
      return await getSignedUrl(client, command, { expiresIn: 3600 });
    }
  } catch (error) {
    console.error("Error generating file URL:", error);
    throw error;
  }
}

export async function deleteFile(cloud_storage_path: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: cloud_storage_path
    });
    await client.send(command);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
