import { z } from 'zod';

import { mediaRef, optionalHttps } from './common';

export const teamSchema = z
  .object({
    name: z.string().trim().min(2, 'Add the name.').max(80),
    role: z.string().trim().min(2, 'Add the role.').max(80),
    department: z.string().trim().max(60),
    location: z.string().trim().max(80),
    bio: z.string().trim().max(400, 'Keep the bio under 400 characters.'),
    photo: mediaRef.nullable(),
    linkedinUrl: optionalHttps,
    portfolioUrl: optionalHttps,
    visible: z.boolean(),
    isAuthor: z.boolean(),
  })
  .superRefine((d, ctx) => {
    if (d.photo && !d.photo.alt) ctx.addIssue({ code: 'custom', path: ['photo'], message: 'Add alt text for the photo.' });
  });

export type TeamInput = z.infer<typeof teamSchema>;
