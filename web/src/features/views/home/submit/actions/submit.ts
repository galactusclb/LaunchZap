'use server'

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "@/lib/aws";
import { baseProductSchema } from "@/models/product.schema";
import { constants } from "@/utils/constants/server";

export type SubmitState = {
    success: boolean
    error?: string
}

export default async function submitAction(
    prevState: SubmitState,
    formData: FormData
): Promise<SubmitState> {
    const result = baseProductSchema.safeParse({
        name: formData.get('name'),
        tagline: formData.get('tagline'),
        description: formData.get('description') || undefined,
        websiteUrl: formData.get('websiteUrl'),
        launchDate: formData.get('launchDate'),
    });

    if (!result.success) {
        return { success: false, error: result.error.issues[0]?.message ?? "Validation failed" };
    }

    const logoFile = formData.get('logoFile');
    let tempLogoURL: string | undefined;
    try {
        if (logoFile instanceof File) {
            tempLogoURL = await uploadFilesToS3(logoFile)
        }
    } catch {
        return { success: false, error: "Failed to upload logo. Please try again." }
    }

    const response = await fetch(`${constants.API.URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...result.data, logoUrl: tempLogoURL }),
    });

    if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        return { success: false, error: json.message ?? "Failed to submit product" };
    }

    return { success: true };
}

async function uploadFilesToS3(image: File): Promise<string | undefined> {
    
    const { client, bucket } = await s3.getS3ClientInstance();

    const uuid = crypto.randomUUID();
    const key = `temp/${uuid}/${image.name}`;

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(await image.arrayBuffer()),
        ContentType: image.type
    });

    try {
        await client.send(command);

        return s3.buildS3Url(key);
    } catch (error) {
        console.error("S3 upload failed:", error);
        throw new Error("Image upload failed")
    }
}