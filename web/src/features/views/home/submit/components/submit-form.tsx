"use client";

import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import useSubmit from "../hooks/useSubmit";

export default function SubmitForm() {
    const { form, onSubmit, state, isPending } = useSubmit();

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Submit a Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="form-submit" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="submit-name">Product Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="submit-name"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={fieldState.invalid ? "submit-name-error" : undefined}
                                        placeholder="My Awesome Product"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError id="submit-name-error" role="alert" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="tagline"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="submit-tagline">Tagline</FieldLabel>
                                    <Input
                                        {...field}
                                        id="submit-tagline"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={fieldState.invalid ? "submit-tagline-error" : undefined}
                                        placeholder="A short, catchy description"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError id="submit-tagline-error" role="alert" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="submit-description">Description (optional)</FieldLabel>
                                    <Input
                                        {...field}
                                        id="submit-description"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={fieldState.invalid ? "submit-description-error" : undefined}
                                        placeholder="Tell us more about your product..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError id="submit-description-error" role="alert" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="websiteUrl"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="submit-websiteUrl">Website URL</FieldLabel>
                                    <Input
                                        {...field}
                                        id="submit-websiteUrl"
                                        type="url"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={fieldState.invalid ? "submit-websiteUrl-error" : undefined}
                                        placeholder="https://myproduct.com"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError id="submit-websiteUrl-error" role="alert" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="logoUrl"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="submit-logoUrl">Logo URL (optional)</FieldLabel>
                                    <Input
                                        {...field}
                                        id="submit-logoUrl"
                                        type="url"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={fieldState.invalid ? "submit-logoUrl-error" : undefined}
                                        placeholder="https://myproduct.com/logo.png"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError id="submit-logoUrl-error" role="alert" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="launchDate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="submit-launchDate">Launch Date</FieldLabel>
                                    <Input
                                        {...field}
                                        id="submit-launchDate"
                                        type="date"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={fieldState.invalid ? "submit-launchDate-error" : undefined}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError id="submit-launchDate-error" role="alert" errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                {state.error && (
                    <p role="alert" aria-live="polite" className="text-destructive text-sm mt-4">
                        {state.error}
                    </p>
                )}
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        form="form-submit"
                        disabled={isPending}
                        aria-disabled={isPending}
                    >
                        {isPending ? "Submitting..." : "Submit Product"}
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
}
