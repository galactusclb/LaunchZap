'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';

import { s3 } from '@/lib/aws';
import { createProductSchema, productCreateResponseSchema } from '@/models/product.schema';
import { apiServer } from '@/utils/api/api-server';

export type SubmitState = {
    success: boolean;
    error?: string;
    productId?: string;
};

export default async function submitAction(
    prevState: SubmitState,
    formData: FormData
): Promise<SubmitState> {
    const result = createProductSchema.safeParse({
        name: formData.get('name'),
        tagline: formData.get('tagline'),
        description: formData.get('description'),
        websiteUrl: formData.get('websiteUrl'),
        status: formData.get('status') || undefined,
    });

    if (!result.success) {
        return { success: false, error: result.error.issues[0]?.message ?? 'Validation failed' };
    }

    const logoFile = formData.get('logoFile');
    let tempLogoURL: string | undefined;
    try {
        if (logoFile instanceof File) {
            tempLogoURL = await uploadFilesToS3(logoFile);
        }
    } catch {
        return { success: false, error: 'Failed to upload logo. Please try again.' };
    }

    try {
        const product = await apiServer('/products', productCreateResponseSchema, {
            method: 'POST',
            body: JSON.stringify({ ...result.data, logoUrl: tempLogoURL }),
        });

        return { success: true, productId: String(product.data!.id) };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to submit product';
        return { success: false, error: message };
    }
}

async function uploadFilesToS3(image: File): Promise<string | undefined> {
    const { client, bucket } = await s3.getS3ClientInstance();

    const uuid = crypto.randomUUID();
    const key = `logos/${uuid}/${image.name}`;

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(await image.arrayBuffer()),
        ContentType: image.type,
    });

    try {
        await client.send(command);

        return s3.buildS3Url(key);
    } catch (error) {
        console.error('S3 upload failed:', error);
        throw new Error('Image upload failed');
    }
}
