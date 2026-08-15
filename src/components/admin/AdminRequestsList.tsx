"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type ContactRequest = RouterOutputs["contact"]["listRequests"][number];

function formatRequestDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatFieldLabel(value: string | null | undefined, fallback = "—") {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

interface RequestDetailProps {
  request: ContactRequest;
  onMarkRead: (id: string) => void;
  isMarking: boolean;
}

function RequestDetail({ request, onMarkRead, isMarking }: RequestDetailProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-border bg-foreground/[0.02] px-4 py-4 md:px-6">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Name
          </dt>
          <dd className="text-sm text-foreground">{request.name}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Email
          </dt>
          <dd className="text-sm text-foreground">
            <a
              href={`mailto:${request.email}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {request.email}
            </a>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Company
          </dt>
          <dd className="text-sm text-foreground">
            {formatFieldLabel(request.company)}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Phone
          </dt>
          <dd className="text-sm text-foreground">
            {request.phone ? (
              <a
                href={`tel:${request.phone}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {request.phone}
              </a>
            ) : (
              formatFieldLabel(request.phone)
            )}
          </dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Received
          </dt>
          <dd className="text-sm text-foreground">
            {formatRequestDate(request.createdAt)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Message
        </p>
        <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-background p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {request.message}
          </p>
        </div>
      </div>

      {!request.isRead ? (
        <div>
          <Button
            size="sm"
            onClick={() => onMarkRead(request.id)}
            disabled={isMarking}
          >
            {isMarking ? "Marking..." : "Mark as read"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

interface RequestRowProps {
  request: ContactRequest;
  expanded: boolean;
  onToggle: () => void;
  onMarkRead: (id: string) => void;
  isMarking: boolean;
}

function RequestRow({
  request,
  expanded,
  onToggle,
  onMarkRead,
  isMarking,
}: RequestRowProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={cn(
          "grid w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-foreground/[0.03] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] md:items-center md:gap-4 md:px-6",
          !request.isRead && "bg-accent/[0.03]",
        )}
      >
        <div className="flex min-w-0 items-center gap-2 md:contents">
          {!request.isRead ? (
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-accent md:order-first"
            />
          ) : (
            <span aria-hidden className="size-2 shrink-0 rounded-full md:order-first" />
          )}
          <span
            className={cn(
              "min-w-0 truncate text-sm text-foreground md:order-1",
              !request.isRead && "font-semibold",
            )}
          >
            {request.name}
          </span>
        </div>

        <span
          className={cn(
            "min-w-0 truncate text-sm text-muted md:order-2",
            !request.isRead && "font-medium text-foreground",
          )}
        >
          <span className="md:hidden">Email: </span>
          {request.email}
        </span>

        <span className="min-w-0 truncate text-sm text-muted md:order-3">
          <span className="md:hidden">Company: </span>
          {formatFieldLabel(request.company)}
        </span>

        <span className="text-sm text-muted md:order-4 md:whitespace-nowrap">
          <span className="md:hidden">Date: </span>
          {formatRequestDate(request.createdAt)}
        </span>

        <div className="flex items-center justify-between gap-3 md:order-5 md:justify-end">
          {request.isRead ? (
            <Badge>Read</Badge>
          ) : (
            <Badge variant="accent">Unread</Badge>
          )}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 shrink-0 text-muted transition-transform",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {expanded ? (
        <RequestDetail
          request={request}
          onMarkRead={onMarkRead}
          isMarking={isMarking}
        />
      ) : null}
    </div>
  );
}

export function AdminRequestsList() {
  const utils = api.useUtils();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: requests = [],
    isLoading,
    isError,
  } = api.contact.listRequests.useQuery();

  const markReadMutation = api.contact.markRequestRead.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.contact.listRequests.invalidate(),
        utils.contact.getUnreadCount.invalidate(),
      ]);
    },
  });

  const handleToggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate({ id });
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading requests…</p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Unable to load requests. Please try again later.
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">No requests yet</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="hidden border-b border-border px-6 py-3 md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] md:gap-4">
        <span className="pl-4 text-xs font-medium uppercase tracking-wide text-muted">
          Name
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Email
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Company
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Date
        </span>
        <span className="text-right text-xs font-medium uppercase tracking-wide text-muted">
          Status
        </span>
      </div>

      {requests.map((request) => (
        <RequestRow
          key={request.id}
          request={request}
          expanded={expandedId === request.id}
          onToggle={() => handleToggle(request.id)}
          onMarkRead={handleMarkRead}
          isMarking={
            markReadMutation.isPending &&
            markReadMutation.variables?.id === request.id
          }
        />
      ))}
    </div>
  );
}
