'use client';

import * as React from 'react';
import { KeyRound, LogOut, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { createAdmin, deleteAdmin, resetAdminPassword, setAdminRole, signOutAdmin } from '@/actions/admin/settings';
import { SelectField, TextField } from '@/components/admin/editor/fields';
import { ConfirmDelete } from '@/components/admin/ui/confirm-delete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { NativeSelect } from '@/components/ui/native-select';
import type { AdminRow } from '@/lib/admin/admins';
import { formatDate } from '@/lib/admin/format';

/** Admin users (owners only): add, change role, reset password, sign out, remove. */
export function AdminUsers({ admins, meId }: { admins: AdminRow[]; meId: string }) {
  const [adding, setAdding] = React.useState(false);
  const [resetFor, setResetFor] = React.useState<AdminRow | null>(null);
  const [form, setForm] = React.useState({ email: '', name: '', role: 'editor' as 'owner' | 'editor', password: '' });
  const [pw, setPw] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, start] = React.useTransition();

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string; fieldErrors?: Record<string, string> }>, done?: () => void) =>
    start(async () => {
      const res = await fn();
      if (res.ok) {
        toast.success(res.message ?? 'Saved');
        setErrors({});
        done?.();
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
      }
    });

  return (
    <section aria-labelledby="admins-title" className="overflow-hidden rounded-md border border-line-subtle bg-surface-1">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-5 py-4">
        <div>
          <h2 id="admins-title" className="type-h5 text-fg">
            Admin users
          </h2>
          <p className="type-caption font-normal text-fg-subtle">Owners manage settings and people; editors manage content and the pipeline.</p>
        </div>
        <Button type="button" onClick={() => setAdding(true)}>
          <UserPlus aria-hidden /> Add admin
        </Button>
      </div>
      <ul className="divide-y divide-line-subtle">
        {admins.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="type-label text-fg">
                {a.name} {a.id === meId && <span className="type-caption font-normal text-fg-subtle">(you)</span>}
              </span>
              <span className="truncate type-caption font-normal text-fg-subtle">
                {a.email} · last sign-in {a.lastLoginAt ? formatDate(a.lastLoginAt) : 'never'}
              </span>
            </span>
            {a.id === meId ? (
              <Badge tone="brand">{a.role}</Badge>
            ) : (
              <label className="w-32">
                <span className="sr-only">Role of {a.name}</span>
                <NativeSelect value={a.role} disabled={pending} onChange={(e) => run(() => setAdminRole(a.id, e.target.value as 'owner' | 'editor'))}>
                  <option value="editor">Editor</option>
                  <option value="owner">Owner</option>
                </NativeSelect>
              </label>
            )}
            <Button type="button" variant="ghost" size="sm" aria-label={`Reset the password of ${a.name}`} onClick={() => { setPw(''); setErrors({}); setResetFor(a); }}>
              <KeyRound aria-hidden /> Reset password
            </Button>
            <Button type="button" variant="ghost" size="sm" aria-label={`Sign out ${a.name} on all devices`} disabled={pending} onClick={() => run(() => signOutAdmin(a.id))}>
              <LogOut aria-hidden /> Sign out
            </Button>
            {a.id !== meId && (
              <ConfirmDelete label={`Remove ${a.name}`} title={`Remove ${a.name}?`} description="They lose access at once. Their past activity stays in the log." action={() => deleteAdmin(a.id)} />
            )}
          </li>
        ))}
      </ul>

      <Dialog
        open={adding}
        onOpenChange={(o) => {
          setAdding(o);
          if (!o) {
            setForm({ email: '', name: '', role: 'editor', password: '' });
            setErrors({});
          }
        }}
      >
        <DialogContent>
          <DialogTitle>Add admin</DialogTitle>
          <DialogDescription>Share the password privately (not by email). It needs 12 or more characters.</DialogDescription>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              run(() => createAdmin(form), () => {
                setAdding(false);
                setForm({ email: '', name: '', role: 'editor', password: '' });
              });
            }}
          >
            <TextField id="a-name" label="Name" required value={form.name} onChange={(x) => setForm({ ...form, name: x })} error={errors.name} />
            <TextField id="a-email" label="Email" required type="email" value={form.email} onChange={(x) => setForm({ ...form, email: x })} error={errors.email} />
            <SelectField id="a-role" label="Role" value={form.role} onChange={(x) => setForm({ ...form, role: x })} options={[{ value: 'editor', label: 'Editor' }, { value: 'owner', label: 'Owner' }]} />
            <TextField id="a-pw" label="Temporary password" required type="password" value={form.password} onChange={(x) => setForm({ ...form, password: x })} error={errors.password} />
            <Button type="submit" loading={pending}>
              Add admin
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!resetFor}
        onOpenChange={(o) => {
          if (!o) {
            setResetFor(null);
            setPw('');
          }
        }}
      >
        <DialogContent>
          <DialogTitle>Reset password for {resetFor?.name}</DialogTitle>
          <DialogDescription>Their sessions end at once. Share the new password privately.</DialogDescription>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (resetFor) run(() => resetAdminPassword(resetFor.id, pw), () => {
                setResetFor(null);
                setPw('');
              });
            }}
          >
            <TextField id="r-pw" label="New password" required type="password" value={pw} onChange={setPw} helper="12 or more characters" error={errors.password} />
            <Button type="submit" loading={pending}>
              Reset password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
