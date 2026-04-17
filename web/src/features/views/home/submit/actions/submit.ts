'use server'

import { baseProductSchema } from "@/models/product.schema";
import { constants } from "@/utils/constants";

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
        logoUrl: formData.get('logoUrl') || undefined,
        launchDate: formData.get('launchDate'),
    });

    if (!result.success) {
        return { success: false, error: result.error.issues[0]?.message ?? "Validation failed" };
    }

    const response = await fetch(`${constants.API.URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(result.data),
    });

    if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        return { success: false, error: json.message ?? "Failed to submit product" };
    }

    return { success: true };
}
