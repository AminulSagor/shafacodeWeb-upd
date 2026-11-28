import { Badge } from '@/components/ui/badge';
import {
  inquiryStatusLabel,
  leadStatusLabel,
  publishLabel,
  stageLabel,
  type ApplicationStage,
  type InquiryStatus,
  type LeadStatus,
  type PublishStatus,
} from '@/lib/admin/types';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const inquiryTone: Record<InquiryStatus, Tone> = { new: 'brand', contacted: 'info', proposal: 'warning', won: 'success', closed: 'neutral' };
const leadTone: Record<LeadStatus, Tone> = { new: 'brand', discussion: 'warning', won: 'success', lost: 'danger' };
const stageTone: Record<ApplicationStage, Tone> = {
  new: 'brand',
  screening: 'info',
  interview: 'warning',
  offer: 'success',
  hired: 'success',
  rejected: 'neutral',
};
const publishTone: Record<PublishStatus, Tone> = { draft: 'neutral', scheduled: 'warning', published: 'success', archived: 'neutral' };

export function InquiryBadge({ status }: { status: InquiryStatus }) {
  return <Badge tone={inquiryTone[status]} dot>{inquiryStatusLabel[status]}</Badge>;
}
export function LeadBadge({ status }: { status: LeadStatus }) {
  return <Badge tone={leadTone[status]} dot>{leadStatusLabel[status]}</Badge>;
}
export function StageBadge({ stage }: { stage: ApplicationStage }) {
  return <Badge tone={stageTone[stage]} dot>{stageLabel[stage]}</Badge>;
}
export function PublishBadge({ status }: { status: PublishStatus }) {
  return <Badge tone={publishTone[status]} dot>{publishLabel[status]}</Badge>;
}
