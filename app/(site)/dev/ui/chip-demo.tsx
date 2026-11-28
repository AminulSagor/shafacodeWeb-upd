'use client';

import { useState } from 'react';

import { Chip } from '@/components/ui/chip';

export function ChipDemo() {
  const [value, setValue] = useState('Web app');
  return (
    <div className="flex flex-wrap gap-2">
      {['Website', 'Web app', 'Mobile app', 'SaaS'].map((c) => (
        <Chip key={c} selected={value === c} onClick={() => setValue(c)}>
          {c}
        </Chip>
      ))}
    </div>
  );
}
