'use client';

import * as React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

import { signIn, type SignInState } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { FormAlert } from '@/components/site/forms/form-parts';
import { Logo } from '@/components/site/logo';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = React.useActionState<SignInState, FormData>(signIn, {});
  const [show, setShow] = React.useState(false);
  const [help, setHelp] = React.useState(false);
  const alertRef = React.useRef<HTMLDivElement>(null);
  const fe = state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.error) alertRef.current?.focus();
  }, [state]);

  return (
    <div className="w-full max-w-110 rounded-card border border-line-subtle bg-surface-1 p-6 sm:p-8">
      <Logo />
      <h1 className="mt-6 type-h3 text-fg">Sign in to Admin</h1>
      <p className="mt-1.5 type-body-sm text-fg-muted">Manage case studies, posts, jobs and inquiries.</p>

      <form action={action} noValidate className="mt-6 flex flex-col gap-5">
        <input type="hidden" name="next" value={next} />
        {state.error && (
          <FormAlert ref={alertRef} className="rounded-field p-3.5">
            {state.error}
          </FormAlert>
        )}
        <Field id="login-email" label="Email" required error={fe.email}>
          {(a) => (
            <Input
              {...a}
              name="email"
              type="email"
              autoComplete="username"
              defaultValue={state.email}
              placeholder="you@shafacode.com"
              autoFocus
            />
          )}
        </Field>
        <Field id="login-password" label="Password" required error={fe.password}>
          {(a) => (
            <div className="relative">
              <Input {...a} name="password" type={show ? 'text' : 'password'} autoComplete="current-password" className="pr-12" />
              <button
                type="button"
                aria-pressed={show}
                aria-label="Show password"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-field text-icon hover:text-icon-strong focus-visible:focus-ring"
              >
                {show ? <EyeOff className="size-4.5" aria-hidden /> : <Eye className="size-4.5" aria-hidden />}
              </button>
            </div>
          )}
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2.5 type-body-sm text-fg">
            <Checkbox name="remember" defaultChecked />
            Keep me signed in
          </label>
          <button
            type="button"
            aria-expanded={help}
            aria-controls="login-forgot"
            onClick={() => setHelp((h) => !h)}
            className="rounded-sm type-label-sm text-fg-brand hover:text-fg-brand-hover focus-visible:focus-ring"
          >
            Forgot password?
          </button>
        </div>
        {help && (
          <p id="login-forgot" className="-mt-2 rounded-field bg-surface-2 p-3 type-body-sm text-fg-muted">
            Ask an owner to set a new password for you in Site Settings, Admin users.
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" loading={pending}>
          Sign in
        </Button>
        <p className="flex items-center gap-2 type-caption font-normal text-fg-subtle">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          Protected area · sessions expire after 8 hours.
        </p>
      </form>
    </div>
  );
}
