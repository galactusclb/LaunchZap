'use client';

import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import useSubmit from '../hooks/useSubmit';

import { LogoUpload } from './logo-upload';
import SubmitSuccessBanner from './submit-success-banner';

export default function SubmitForm() {
    const { form, onSubmit, state, isPending, showBanner, dismissBanner } = useSubmit();

    if (showBanner) {
        return <SubmitSuccessBanner productId={state.productId!} onDismiss={dismissBanner} />;
    }

    return (
        <div className="w-full">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight">Submit a Product</h1>
                <p className="mt-2 text-muted-foreground">Your product deserves to be seen.</p>
            </div>

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
                                    aria-describedby={
                                        fieldState.invalid ? 'submit-name-error' : undefined
                                    }
                                    placeholder="My Awesome Product"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        id="submit-name-error"
                                        role="alert"
                                        errors={[fieldState.error]}
                                    />
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
                                    aria-describedby={
                                        fieldState.invalid ? 'submit-tagline-error' : undefined
                                    }
                                    placeholder="A short, catchy description"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        id="submit-tagline-error"
                                        role="alert"
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="submit-description">
                                    Description (optional)
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="submit-description"
                                    aria-invalid={fieldState.invalid}
                                    aria-describedby={
                                        fieldState.invalid ? 'submit-description-error' : undefined
                                    }
                                    placeholder="Tell us more about your product..."
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        id="submit-description-error"
                                        role="alert"
                                        errors={[fieldState.error]}
                                    />
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
                                    aria-describedby={
                                        fieldState.invalid ? 'submit-websiteUrl-error' : undefined
                                    }
                                    placeholder="https://myproduct.com"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        id="submit-websiteUrl-error"
                                        role="alert"
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="logoFile"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="submit-logoUrl">Logo (optional)</FieldLabel>
                                <LogoUpload
                                    onChange={(file) => field.onChange(file ?? undefined)}
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        id="submit-logoUrl-error"
                                        role="alert"
                                        errors={[fieldState.error]}
                                    />
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
                                    aria-describedby={
                                        fieldState.invalid ? 'submit-launchDate-error' : undefined
                                    }
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        id="submit-launchDate-error"
                                        role="alert"
                                        errors={[fieldState.error]}
                                    />
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

            <div className="mt-8 flex flex-col gap-3">
                <Button
                    type="submit"
                    form="form-submit"
                    disabled={isPending}
                    aria-disabled={isPending}
                    className="w-full h-12 text-base font-semibold bg-brand text-brand-foreground border-transparent"
                >
                    {isPending ? 'Submitting...' : 'Submit Product'}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => form.reset()}
                    className="text-muted-foreground text-sm"
                >
                    Reset form
                </Button>
            </div>
        </div>
    );
}
