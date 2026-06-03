import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { baseProductSchema } from '@/models/product.schema';

import submitAction, { SubmitState } from '../actions/submit';

const formSchema = baseProductSchema.extend({
    logoFile: z.instanceof(File).optional(),
    launchDate: z.string().min(1, 'Launch date is required'),
});

type FormValues = z.infer<typeof formSchema>;

const initState: SubmitState = { success: false };

export default function useSubmit() {
    const [state, setState] = useState<SubmitState>(initState);
    const [isPending, startTransition] = useTransition();
    const [showBanner, setShowBanner] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            tagline: '',
            description: '',
            websiteUrl: '',
            logoFile: undefined,
        },
    });

    function onSubmit(data: FormValues) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('tagline', data.tagline);
        if (data.description) formData.append('description', data.description);
        formData.append('websiteUrl', data.websiteUrl);
        formData.append('launchDate', data.launchDate);
        if (data.logoFile) formData.append('logoFile', data.logoFile);

        startTransition(async () => {
            const result = await submitAction(state, formData);
            setState(result);
            if (result.success) setShowBanner(true);
            if (result.error) toast.error(result.error);
        });
    }

    function dismissBanner() {
        setShowBanner(false);
        form.reset();
    }

    return {
        form,
        onSubmit,
        state,
        isPending,
        showBanner,
        dismissBanner,
    };
}
