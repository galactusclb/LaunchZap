import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { baseProductSchema } from "@/models/product.schema";

import submitAction, { SubmitState } from "../actions/submit";

const formSchema = baseProductSchema.extend({
    logoFile: z.instanceof(File).optional(),
    launchDate: z.string().min(1, "Launch date is required"),
});

type FormValues = z.infer<typeof formSchema>;

const initState: SubmitState = {
    success: false,
};

export default function useSubmit() {
    const [state, formAction, isPending] = useActionState(submitAction, initState);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            tagline: "",
            description: "",
            websiteUrl: "",
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

        startTransition(() => {
            formAction(formData);
        });
    }

    useEffect(() => {
        if (state.success) {
            toast.success("Product submitted successfully!");
            form.reset();
        }
        if (state.error) {
            toast.error(state.error);
        }
    }, [state, form]);

    return {
        form,
        onSubmit,
        state,
        isPending,
    };
}
