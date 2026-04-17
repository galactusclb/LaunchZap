import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { baseProductSchema } from "@/models/product.schema";
import submitAction, { SubmitState } from "../actions/submit";

const formSchema = baseProductSchema.extend({
    logoUrl: z.union([z.url(), z.literal("")]).optional(),
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
            logoUrl: "",
        },
    });

    function onSubmit(data: FormValues) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('tagline', data.tagline);
        if (data.description) formData.append('description', data.description);
        formData.append('websiteUrl', data.websiteUrl);
        if (data.logoUrl) formData.append('logoUrl', data.logoUrl);
        formData.append('launchDate', data.launchDate);

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
