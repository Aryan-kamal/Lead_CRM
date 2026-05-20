/** Sources from the lead model / seed data */
export const KNOWN_SOURCES = [
  'website',
  'referral',
  'campaign',
  'cold-outreach',
  'event',
] as const;

/** Shown in the source filter dropdown */
export const SOURCE_FILTER_OPTIONS = [...KNOWN_SOURCES, 'others'] as const;

export type KnownSource = (typeof KNOWN_SOURCES)[number];
