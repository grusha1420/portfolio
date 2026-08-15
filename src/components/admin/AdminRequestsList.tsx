"use client";

import { Archive, ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCol,
  AdminTableColGroup,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "~/components/admin/admin-table";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type ContactRequest = RouterOutputs["contact"]["listRequests"][number];
type RequestsTab = "current" | "archived";

const TABS: { id: RequestsTab; label: string }[] = [
  { id: "current", label: "Current" },
  { id: "archived", label: "Archived" },
];

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
  tab: RequestsTab;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  isMarking: boolean;
  isArchiving: boolean;
  isUnarchiving: boolean;
}

function RequestDetail({
  request,
  tab,
  onMarkRead,
  onArchive,
  onUnarchive,
  isMarking,
  isArchiving,
  isUnarchiving,
}: RequestDetailProps) {
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

      <div className="flex flex-wrap gap-2">
        {tab === "current" ? (
          <>
            {!request.isRead ? (
              <Button
                size="sm"
                onClick={() => onMarkRead(request.id)}
                disabled={isMarking}
              >
                {isMarking ? "Marking..." : "Mark as read"}
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onArchive(request.id)}
              disabled={isArchiving}
            >
              <Archive className="size-4" aria-hidden />
              {isArchiving ? "Archiving..." : "Archive"}
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onUnarchive(request.id)}
            disabled={isUnarchiving}
          >
            <RotateCcw className="size-4" aria-hidden />
            {isUnarchiving ? "Restoring..." : "Restore to current"}
          </Button>
        )}
      </div>
    </div>
  );
}

interface RequestRowProps {
  request: ContactRequest;
  tab: RequestsTab;
  expanded: boolean;
  onToggle: () => void;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  isMarking: boolean;
  isArchiving: boolean;
  isUnarchiving: boolean;
}

function RequestRow({
  request,
  tab,
  expanded,
  onToggle,
  onMarkRead,
  onArchive,
  onUnarchive,
  isMarking,
  isArchiving,
  isUnarchiving,
}: RequestRowProps) {
  const showUnread = tab === "current" && !request.isRead;

  return (
    <>
      <AdminTableRow
        onClick={onToggle}
        aria-expanded={expanded}
        className={cn(
          "cursor-pointer transition-colors hover:bg-foreground/[0.03]",
          showUnread && "bg-accent/[0.03]",
        )}
      >
        <AdminTableCell>
          <div className="flex min-w-0 items-center gap-2">
            {showUnread ? (
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-accent"
              />
            ) : (
              <span aria-hidden className="size-2 shrink-0 rounded-full" />
            )}
            <span
              className={cn(
                "min-w-0 truncate text-sm text-foreground",
                showUnread && "font-semibold",
              )}
            >
              {request.name}
            </span>
          </div>
        </AdminTableCell>

        <AdminTableCell>
          <span
            className={cn(
              "block min-w-0 truncate text-sm text-muted",
              showUnread && "font-medium text-foreground",
            )}
          >
            {request.email}
          </span>
        </AdminTableCell>

        <AdminTableCell>
          <span className="block min-w-0 truncate text-sm text-muted">
            {formatFieldLabel(request.company)}
          </span>
        </AdminTableCell>

        <AdminTableCell>
          <span className="block text-sm text-muted whitespace-nowrap">
            {formatRequestDate(request.createdAt)}
          </span>
        </AdminTableCell>

        <AdminTableCell align="right">
          <div className="flex items-center justify-end gap-3">
            {tab === "archived" ? (
              <Badge>Archived</Badge>
            ) : request.isRead ? (
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
        </AdminTableCell>
      </AdminTableRow>

      {expanded ? (
        <AdminTableRow>
          <AdminTableCell colSpan={5} className="p-0">
            <RequestDetail
              request={request}
              tab={tab}
              onMarkRead={onMarkRead}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              isMarking={isMarking}
              isArchiving={isArchiving}
              isUnarchiving={isUnarchiving}
            />
          </AdminTableCell>
        </AdminTableRow>
      ) : null}
    </>
  );
}

function RequestsTable({
  requests,
  tab,
  expandedId,
  onToggle,
  onMarkRead,
  onArchive,
  onUnarchive,
  markReadMutation,
  archiveMutation,
  unarchiveMutation,
}: {
  requests: ContactRequest[];
  tab: RequestsTab;
  expandedId: string | null;
  onToggle: (id: string) => void;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  markReadMutation: ReturnType<typeof api.contact.markRequestRead.useMutation>;
  archiveMutation: ReturnType<typeof api.contact.archiveRequest.useMutation>;
  unarchiveMutation: ReturnType<typeof api.contact.unarchiveRequest.useMutation>;
}) {
  if (requests.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        {tab === "current" ? "No current requests" : "No archived requests"}
      </p>
    );
  }

  return (
    <AdminTable minWidth="640px">
      <AdminTableColGroup>
        <AdminTableCol className="w-40" />
        <AdminTableCol />
        <AdminTableCol className="w-36" />
        <AdminTableCol className="w-44" />
        <AdminTableCol className="w-36" />
      </AdminTableColGroup>
      <AdminTableHead>
        <AdminTableRow>
          <AdminTableHeaderCell>Name</AdminTableHeaderCell>
          <AdminTableHeaderCell>Email</AdminTableHeaderCell>
          <AdminTableHeaderCell>Company</AdminTableHeaderCell>
          <AdminTableHeaderCell>Date</AdminTableHeaderCell>
          <AdminTableHeaderCell align="right">Status</AdminTableHeaderCell>
        </AdminTableRow>
      </AdminTableHead>
      <AdminTableBody>
        {requests.map((request) => (
          <RequestRow
            key={request.id}
            request={request}
            tab={tab}
            expanded={expandedId === request.id}
            onToggle={() => onToggle(request.id)}
            onMarkRead={onMarkRead}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            isMarking={
              markReadMutation.isPending &&
              markReadMutation.variables?.id === request.id
            }
            isArchiving={
              archiveMutation.isPending &&
              archiveMutation.variables?.id === request.id
            }
            isUnarchiving={
              unarchiveMutation.isPending &&
              unarchiveMutation.variables?.id === request.id
            }
          />
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}

export function AdminRequestsList() {
  const utils = api.useUtils();
  const [activeTab, setActiveTab] = useState<RequestsTab>("current");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: requests = [],
    isLoading,
    isError,
  } = api.contact.listRequests.useQuery({
    archived: activeTab === "archived",
  });

  const invalidateRequests = async () => {
    await Promise.all([
      utils.contact.listRequests.invalidate({ archived: false }),
      utils.contact.listRequests.invalidate({ archived: true }),
      utils.contact.getUnreadCount.invalidate(),
    ]);
  };

  const markReadMutation = api.contact.markRequestRead.useMutation({
    onSuccess: invalidateRequests,
  });

  const archiveMutation = api.contact.archiveRequest.useMutation({
    onSuccess: async () => {
      setExpandedId(null);
      await invalidateRequests();
    },
  });

  const unarchiveMutation = api.contact.unarchiveRequest.useMutation({
    onSuccess: async () => {
      setExpandedId(null);
      await invalidateRequests();
    },
  });

  const handleToggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleTabChange = (tab: RequestsTab) => {
    setActiveTab(tab);
    setExpandedId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <nav
        className="flex gap-1 border-b border-border"
        aria-label="Requests tabs"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-muted">Loading requests…</p>
      ) : isError ? (
        <p className="py-16 text-center text-sm text-muted">
          Unable to load requests. Please try again later.
        </p>
      ) : (
        <RequestsTable
          requests={requests}
          tab={activeTab}
          expandedId={expandedId}
          onToggle={handleToggle}
          onMarkRead={(id) => markReadMutation.mutate({ id })}
          onArchive={(id) => archiveMutation.mutate({ id })}
          onUnarchive={(id) => unarchiveMutation.mutate({ id })}
          markReadMutation={markReadMutation}
          archiveMutation={archiveMutation}
          unarchiveMutation={unarchiveMutation}
        />
      )}
    </div>
  );
}
