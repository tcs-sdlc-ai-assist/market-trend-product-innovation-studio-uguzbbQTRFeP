/**
 * Application-wide constants and configuration values
 * for Market Trend Innovation Studio.
 */

// =============================================================================
// LocalStorage Keys
// =============================================================================

/** @type {string} Key for persisting workspaces data */
export const WORKSPACES_KEY = 'mtis_workspaces';

/** @type {string} Key for persisting scoring configuration */
export const SCORING_CONFIG_KEY = 'mtis_scoring_config';

/** @type {string} Key for persisting backlog items */
export const BACKLOG_KEY = 'mtis_backlog';

/** @type {string} Key for persisting user preferences */
export const PREFERENCES_KEY = 'mtis_preferences';

/** @type {string} Key for persisting trend data */
export const TRENDS_KEY = 'mtis_trends';

/** @type {string} Key for persisting concepts */
export const CONCEPTS_KEY = 'mtis_concepts';

// =============================================================================
// Scoring Configuration
// =============================================================================

/** @type {Record<string, number>} Default scoring weights (must sum to 1.0) */
export const DEFAULT_SCORING_WEIGHTS = {
  marketPotential: 0.25,
  feasibility: 0.2,
  strategicFit: 0.2,
  innovationLevel: 0.15,
  consumerAppeal: 0.2,
};

/** @type {string[]} Scoring criteria names in display order */
export const SCORING_CRITERIA = [
  'Market Potential',
  'Feasibility',
  'Strategic Fit',
  'Innovation Level',
  'Consumer Appeal',
];

/** @type {Record<string, string>} Map of scoring criteria keys to display names */
export const SCORING_CRITERIA_MAP = {
  marketPotential: 'Market Potential',
  feasibility: 'Feasibility',
  strategicFit: 'Strategic Fit',
  innovationLevel: 'Innovation Level',
  consumerAppeal: 'Consumer Appeal',
};

/** @type {number} Minimum score value */
export const SCORE_MIN = 1;

/** @type {number} Maximum score value */
export const SCORE_MAX = 10;

// =============================================================================
// Region Options
// =============================================================================

/** @type {string[]} Available region options for dropdowns */
export const REGIONS = [
  'North America',
  'Latin America',
  'Europe',
  'Middle East & Africa',
  'Asia Pacific',
  'Greater China',
  'Japan',
  'Global',
];

// =============================================================================
// Segment Options
// =============================================================================

/** @type {string[]} Available market segment options */
export const SEGMENTS = [
  'Fine Fragrance',
  'Personal Care',
  'Home Care',
  'Oral Care',
  'Beverages',
  'Dairy',
  'Savory',
  'Snacks',
  'Sweet Goods',
  'Health & Wellness',
];

// =============================================================================
// Trend Categories
// =============================================================================

/** @type {string[]} Available trend category options */
export const TREND_CATEGORIES = [
  'Consumer Behavior',
  'Sustainability',
  'Health & Wellness',
  'Technology & Innovation',
  'Cultural Shifts',
  'Regulatory & Compliance',
  'Ingredient Innovation',
  'Sensory Experience',
];

// =============================================================================
// Goal / Strategic Objective Options
// =============================================================================

/** @type {string[]} Available strategic goal options */
export const GOALS = [
  'Revenue Growth',
  'Market Share Expansion',
  'New Market Entry',
  'Product Line Extension',
  'Sustainability Leadership',
  'Digital Transformation',
  'Consumer Engagement',
  'Operational Efficiency',
  'Brand Differentiation',
  'Cost Optimization',
];

// =============================================================================
// Backlog Tags
// =============================================================================

/** @type {string[]} Available backlog priority tags */
export const BACKLOG_TAGS = [
  'MVP',
  'Next Release',
  'Future Enhancement',
];

// =============================================================================
// Backlog Statuses
// =============================================================================

/** @type {string[]} Available backlog item statuses */
export const BACKLOG_STATUSES = [
  'Idea',
  'Under Review',
  'Approved',
  'In Progress',
  'Completed',
  'Archived',
];

// =============================================================================
// Confidence Levels
// =============================================================================

/** @type {{ label: string, value: string }[]} Confidence level options */
export const CONFIDENCE_LEVELS = [
  { label: 'Very Low', value: 'very_low' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Very High', value: 'very_high' },
];

// =============================================================================
// Prototype Disclaimer
// =============================================================================

/** @type {string} Disclaimer text displayed in the prototype banner */
export const PROTOTYPE_DISCLAIMER =
  'This is an MVP prototype for demonstration purposes only. Data is stored locally in your browser and is not persisted to any server.';

// =============================================================================
// Application Metadata
// =============================================================================

/** @type {string} Application title (fallback if env var is not set) */
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Market Trend Innovation Studio';

/** @type {string} Application version (fallback if env var is not set) */
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

/** @type {string} Brand mode for theming */
export const BRAND_MODE = import.meta.env.VITE_BRAND_MODE || 'placeholder';