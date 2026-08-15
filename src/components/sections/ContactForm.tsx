"use client";

import { useState } from "react";
import { type ZodIssue } from "zod";

import { Button, Input, Label, Textarea } from "~/components/ui";
import { cn } from "~/lib/cn";
import { contactRequestSchema } from "~/server/api/schemas";
import { api } from "~/trpc/react";

type FormFields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

const INITIAL_FIELDS: FormFields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

function fieldErrorsFromIssues(issues: ZodIssue[]): Partial<Record<keyof FormFields, string>> {
  const errors: Partial<Record<keyof FormFields, string>> = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field in INITIAL_FIELDS && !errors[field as keyof FormFields]) {
      errors[field as keyof FormFields] = issue.message;
    }
  }

  return errors;
}

export function ContactForm() {
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitMutation = api.contact.submitRequest.useMutation({
    onSuccess: () => {
      setFields(INITIAL_FIELDS);
      setFieldErrors({});
      setFormError(null);
      setSuccessMessage("Message sent");
    },
    onError: () => {
      setSuccessMessage(null);
      setFormError("Something went wrong. Please try again.");
    },
  });

  const updateField = (key: keyof FormFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setSuccessMessage(null);

    if (fieldErrors[key]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      company: fields.company.trim() || undefined,
      phone: fields.phone.trim() || undefined,
      message: fields.message.trim(),
    };

    const parsed = contactRequestSchema.safeParse(payload);

    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromIssues(parsed.error.issues));
      return;
    }

    setFieldErrors({});
    submitMutation.mutate(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name" required>
            Name
          </Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          />
          {fieldErrors.name ? (
            <p id="contact-name-error" className="text-sm text-red-600">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-company">Company</Label>
          <Input
            id="contact-company"
            name="company"
            autoComplete="organization"
            value={fields.company}
            onChange={(event) => updateField("company", event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email" required>
            Email
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          />
          {fieldErrors.email ? (
            <p id="contact-email-error" className="text-sm text-red-600">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message" required>
          Message
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="contact-message-error" className="text-sm text-red-600">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
      {successMessage ? (
        <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={submitMutation.isPending}
        className={cn("w-fit self-start")}
      >
        {submitMutation.isPending ? "Sending..." : "Send →"}
      </Button>
    </form>
  );
}
