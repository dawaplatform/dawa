/**
 * Friendly translation of listing auto-moderation reasons for the admin UI.
 *
 * Backend stores the raw pipeline reason on `Item.rejection_reason` (for
 * `Rejected`) or `Item.metadata.moderation_reason` (for `needs_review` /
 * transient failures). Both use the phrasing from
 * `dawa-backend/listingModeration/pipeline.py`.
 *
 * The admin sees the plain-English summary + which pipeline stage flagged
 * the listing. We deliberately never surface raw scores or category
 * labels — those are noise for a human reviewer.
 */

type ModerationInput = {
  approval_status?: string | null;
  rejection_reason?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type ModerationStage =
  | 'keywords'
  | 'phash'
  | 'metadata'
  | 'profanity'
  | 'text'
  | 'image'
  | 'openai'
  | 'unknown';

export type ModerationNote = {
  state: 'approved' | 'rejected' | 'needs_review' | 'pending' | 'failed';
  headline: string;
  message: string;
  stageLabel: string;
  stage: ModerationStage;
  /** Raw reason string, kept for the audit trail (still shown to admins). */
  rawReason: string;
  /** True when the pipeline itself made the call (vs. an admin action). */
  autoModerated: boolean;
};

const STAGE_LABELS: Record<ModerationStage, string> = {
  keywords: 'Banned keyword',
  phash: 'Photo blocklist',
  metadata: 'Photo metadata',
  profanity: 'Profanity filter',
  text: 'Text safety model',
  image: 'Image safety model',
  openai: 'OpenAI moderation',
  unknown: 'Auto moderation',
};

function detectStage(reason: string): ModerationStage {
  const r = reason.toLowerCase();
  if (r.includes('banned keyword')) return 'keywords';
  if (r.includes('known-bad hash') || r.includes('matches known')) return 'phash';
  if (r.includes('image metadata') || r.includes('watermark') || r.includes('ai generator')) return 'metadata';
  if (r.includes('profanity')) return 'profanity';
  if (r.includes('openai moderation')) return 'openai';
  if (r.includes('image policy score')) return 'image';
  if (r.includes('text policy score')) return 'text';
  return 'unknown';
}

function extractReason(item: ModerationInput): string {
  const direct = (item.rejection_reason || '').toString().trim();
  if (direct) return direct;
  const md = (item.metadata || {}) as Record<string, unknown>;
  return String((md.moderation_reason as string | undefined) || '').trim();
}

/** Strip raw numeric scores from a pipeline reason before showing it to admins. */
export function sanitizeReasonForDisplay(reason: string): string {
  if (!reason) return '';
  return reason
    // "text policy score 0.85 exceeds reject threshold" -> "text policy exceeds reject threshold"
    .replace(/\b(text|image) policy score \d+\.\d+\s*/gi, '$1 policy ')
    // "text score 0.85 >= reject threshold" -> "text policy exceeds reject threshold"
    .replace(/\b(text|image) score \d+\.\d+\s*/gi, '$1 policy ')
    // Trim any dangling percentages / floats.
    .replace(/\b\d+\.\d+\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const REJECTED_MESSAGES: Partial<Record<ModerationStage, string>> = {
  keywords: 'The title or description contains words that violate our listing policy (weapons, drugs, stolen goods, etc.).',
  phash: 'One of the photos matches an image previously flagged on Dawa.',
  metadata: 'Photo metadata suggests it is stock, AI-generated, or reused from another site.',
  profanity: 'The listing text contains profanity or offensive language.',
  text: 'The text safety model flagged the listing (toxic, sexual, violent, or scam-adjacent language).',
  image: 'The vision safety model flagged one of the photos.',
  openai: 'OpenAI omni-moderation flagged this listing.',
};

const NEEDS_REVIEW_MESSAGES: Partial<Record<ModerationStage, string>> = {
  text: 'The text safety model returned an ambiguous score — a human should decide.',
  image: 'The vision safety model returned an ambiguous score — a human should decide.',
  unknown: 'The auto-moderation models were unavailable; a human should review this listing.',
};

/**
 * Return an admin-facing summary, or `null` when there is nothing to show
 * (e.g. approved listing with no metadata attached).
 */
export function summarizeModeration(item: ModerationInput): ModerationNote | null {
  const status = (item.approval_status || 'Pending').toString();
  const md = (item.metadata || {}) as Record<string, unknown>;
  const rawReason = extractReason(item);
  const stage = rawReason ? detectStage(rawReason) : 'unknown';
  const stageLabel = STAGE_LABELS[stage];
  const autoModerated = Boolean(md.moderation_state) || Boolean(md.moderation_reason);

  if (status === 'Rejected') {
    const message =
      REJECTED_MESSAGES[stage] ||
      (rawReason ? 'This listing was rejected during automated review.' : 'This listing was rejected.');
    return {
      state: 'rejected',
      headline: autoModerated ? 'Auto-rejected by the moderation pipeline' : 'Rejected',
      message,
      stageLabel,
      stage,
      rawReason,
      autoModerated,
    };
  }

  if (status === 'Approved') {
    if (!autoModerated) return null;
    return {
      state: 'approved',
      headline: 'Auto-approved by the moderation pipeline',
      message: 'All cheap-tier checks and the safety models were clean.',
      stageLabel,
      stage,
      rawReason,
      autoModerated: true,
    };
  }

  // Pending
  const needsReview = md.needs_review === true || md.moderation_state === 'needs_review';
  if (needsReview) {
    const message =
      NEEDS_REVIEW_MESSAGES[stage] ||
      'The auto-moderation pipeline flagged this listing for a human reviewer.';
    return {
      state: 'needs_review',
      headline: 'Needs human review',
      message,
      stageLabel,
      stage,
      rawReason,
      autoModerated: true,
    };
  }

  if (md.moderation_state === 'failed') {
    return {
      state: 'failed',
      headline: 'Pipeline errored — will retry',
      message: 'The moderation drain hit a transient error on this listing. It will be retried on the next pass.',
      stageLabel,
      stage,
      rawReason,
      autoModerated: true,
    };
  }

  return {
    state: 'pending',
    headline: 'Awaiting automated review',
    message: 'The moderation drain has not processed this listing yet.',
    stageLabel,
    stage,
    rawReason,
    autoModerated: false,
  };
}
