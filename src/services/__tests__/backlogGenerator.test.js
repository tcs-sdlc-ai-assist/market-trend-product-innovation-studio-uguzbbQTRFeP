import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateBacklog,
  tagBacklogItem,
  updateBacklogItemStatus,
  flattenBacklog,
  getBacklogSummary,
  validateBacklogInputs,
} from '../backlogGenerator.js';
import { BACKLOG_TAGS, BACKLOG_STATUSES } from '../../utils/constants.js';

describe('backlogGenerator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const validConcept = {
    id: 'concept-1',
    name: 'Test Concept Alpha',
    description: 'A detailed test concept for backlog generation with sufficient context.',
    valueProposition: 'Delivers unique value through innovative formulation and consumer engagement.',
    targetUser: 'Health-conscious millennials aged 25-35',
    differentiation: 'First-to-market combination of proprietary ingredients.',
    rationale: 'Strong strategic fit with current portfolio.',
    keyFeatures: ['Feature A', 'Feature B', 'Feature C'],
    estimatedTimeline: '12-14 months',
    region: 'North America',
    segment: 'Beverages',
    trend: 'Health & Wellness',
    goal: 'Revenue Growth',
  };

  const secondConcept = {
    id: 'concept-2',
    name: 'Test Concept Beta',
    description: 'A second test concept for multi-concept backlog generation.',
    valueProposition: 'Premium personal care with blockchain-verified traceability.',
    targetUser: 'Sustainability-minded Gen Z consumers',
    differentiation: 'Full supply chain transparency via blockchain.',
    rationale: 'Aligns with sustainability leadership goals.',
    keyFeatures: ['Traceability', 'Refillable packaging'],
    estimatedTimeline: '14-16 months',
    region: 'Europe',
    segment: 'Personal Care',
    trend: 'Sustainability',
    goal: 'Sustainability Leadership',
  };

  const minimalConcept = {
    name: 'Minimal Concept',
  };

  // ===========================================================================
  // validateBacklogInputs
  // ===========================================================================

  describe('validateBacklogInputs', () => {
    it('returns valid for a valid concepts array', () => {
      const result = validateBacklogInputs([validConcept]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('returns valid for multiple valid concepts', () => {
      const result = validateBacklogInputs([validConcept, secondConcept]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('returns valid for a minimal concept with only a name', () => {
      const result = validateBacklogInputs([minimalConcept]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('returns invalid when concepts is null', () => {
      const result = validateBacklogInputs(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when concepts is undefined', () => {
      const result = validateBacklogInputs(undefined);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when concepts is not an array', () => {
      const result = validateBacklogInputs('not-an-array');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when concepts array is empty', () => {
      const result = validateBacklogInputs([]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns invalid when a concept is missing a name', () => {
      const result = validateBacklogInputs([{ id: 'no-name' }]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('name'))).toBe(true);
    });

    it('returns invalid when a concept has an empty name', () => {
      const result = validateBacklogInputs([{ name: '   ' }]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('name'))).toBe(true);
    });

    it('returns invalid when a concept is not an object', () => {
      const result = validateBacklogInputs([null, 'string']);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validates multiple concepts and reports all errors', () => {
      const result = validateBacklogInputs([
        { name: 'Valid' },
        { id: 'no-name' },
        null,
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
    });
  });

  // ===========================================================================
  // generateBacklog
  // ===========================================================================

  describe('generateBacklog', () => {
    it('generates a backlog with correct hierarchy for a single concept', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.result).not.toBeNull();
      expect(Array.isArray(result.result.epics)).toBe(true);
      expect(result.result.epics.length).toBe(1);
    });

    it('generates one epic per concept', () => {
      const result = generateBacklog([validConcept, secondConcept]);

      expect(result.success).toBe(true);
      expect(result.result.epics.length).toBe(2);
    });

    it('each epic has the correct type', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(epic.type).toBe('epic');
    });

    it('each epic has a unique id', () => {
      const result = generateBacklog([validConcept, secondConcept]);

      expect(result.success).toBe(true);
      const ids = result.result.epics.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('each epic has a title containing the concept name', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(epic.title).toContain(validConcept.name);
    });

    it('each epic has a description', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(typeof epic.description).toBe('string');
      expect(epic.description.length).toBeGreaterThan(0);
    });

    it('each epic has a valid tag', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(BACKLOG_TAGS).toContain(epic.tag);
    });

    it('each epic has a valid status', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(BACKLOG_STATUSES).toContain(epic.status);
    });

    it('each epic has conceptId and conceptName', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(epic.conceptId).toBe(validConcept.id);
      expect(epic.conceptName).toBe(validConcept.name);
    });

    it('each epic has createdAt and updatedAt timestamps', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(epic.createdAt).toBeDefined();
      expect(epic.updatedAt).toBeDefined();
      expect(new Date(epic.createdAt).toISOString()).toBe(epic.createdAt);
      expect(new Date(epic.updatedAt).toISOString()).toBe(epic.updatedAt);
    });

    it('each epic contains features array', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(Array.isArray(epic.features)).toBe(true);
      expect(epic.features.length).toBeGreaterThan(0);
    });

    it('each feature has the correct type', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        expect(feature.type).toBe('feature');
      }
    });

    it('each feature has a unique id', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      const ids = features.map((f) => f.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('each feature has a title and description', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        expect(typeof feature.title).toBe('string');
        expect(feature.title.length).toBeGreaterThan(0);
        expect(typeof feature.description).toBe('string');
        expect(feature.description.length).toBeGreaterThan(0);
      }
    });

    it('each feature has a valid tag', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        expect(BACKLOG_TAGS).toContain(feature.tag);
      }
    });

    it('each feature has a valid status', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        expect(BACKLOG_STATUSES).toContain(feature.status);
      }
    });

    it('each feature has conceptId, conceptName, and epicId', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      for (const feature of epic.features) {
        expect(feature.conceptId).toBe(validConcept.id);
        expect(feature.conceptName).toBe(validConcept.name);
        expect(feature.epicId).toBe(epic.id);
      }
    });

    it('each feature contains userStories array', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        expect(Array.isArray(feature.userStories)).toBe(true);
      }
    });

    it('at least some features have user stories', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      const featuresWithStories = features.filter((f) => f.userStories.length > 0);
      expect(featuresWithStories.length).toBeGreaterThan(0);
    });

    it('each user story has the correct type', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        for (const story of feature.userStories) {
          expect(story.type).toBe('user-story');
        }
      }
    });

    it('each user story has a unique id', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const allStoryIds = [];
      for (const epic of result.result.epics) {
        for (const feature of epic.features) {
          for (const story of feature.userStories) {
            allStoryIds.push(story.id);
          }
        }
      }
      expect(new Set(allStoryIds).size).toBe(allStoryIds.length);
    });

    it('each user story has a title and description', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        for (const story of feature.userStories) {
          expect(typeof story.title).toBe('string');
          expect(story.title.length).toBeGreaterThan(0);
          expect(typeof story.description).toBe('string');
          expect(story.description.length).toBeGreaterThan(0);
        }
      }
    });

    it('each user story has a valid tag', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        for (const story of feature.userStories) {
          expect(BACKLOG_TAGS).toContain(story.tag);
        }
      }
    });

    it('each user story has a valid status', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        for (const story of feature.userStories) {
          expect(BACKLOG_STATUSES).toContain(story.status);
        }
      }
    });

    it('each user story has conceptId, conceptName, featureId, and epicId', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      for (const feature of epic.features) {
        for (const story of feature.userStories) {
          expect(story.conceptId).toBe(validConcept.id);
          expect(story.conceptName).toBe(validConcept.name);
          expect(story.featureId).toBe(feature.id);
          expect(story.epicId).toBe(epic.id);
        }
      }
    });

    it('each user story has acceptance criteria array', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const features = result.result.epics[0].features;
      for (const feature of features) {
        for (const story of feature.userStories) {
          expect(Array.isArray(story.acceptanceCriteria)).toBe(true);
        }
      }
    });

    it('at least some user stories have non-empty acceptance criteria', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      let hasAcceptanceCriteria = false;
      for (const epic of result.result.epics) {
        for (const feature of epic.features) {
          for (const story of feature.userStories) {
            if (story.acceptanceCriteria.length > 0) {
              hasAcceptanceCriteria = true;
            }
          }
        }
      }
      expect(hasAcceptanceCriteria).toBe(true);
    });

    it('each acceptance criterion has an id and description', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      for (const epic of result.result.epics) {
        for (const feature of epic.features) {
          for (const story of feature.userStories) {
            for (const criterion of story.acceptanceCriteria) {
              expect(typeof criterion.id).toBe('string');
              expect(criterion.id.length).toBeGreaterThan(0);
              expect(typeof criterion.description).toBe('string');
              expect(criterion.description.length).toBeGreaterThan(0);
            }
          }
        }
      }
    });

    it('result includes totalEpics count', () => {
      const result = generateBacklog([validConcept, secondConcept]);

      expect(result.success).toBe(true);
      expect(result.result.totalEpics).toBe(2);
    });

    it('result includes totalFeatures count', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      expect(typeof result.result.totalFeatures).toBe('number');
      expect(result.result.totalFeatures).toBeGreaterThan(0);

      let featureCount = 0;
      for (const epic of result.result.epics) {
        featureCount += epic.features.length;
      }
      expect(result.result.totalFeatures).toBe(featureCount);
    });

    it('result includes totalUserStories count', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      expect(typeof result.result.totalUserStories).toBe('number');

      let storyCount = 0;
      for (const epic of result.result.epics) {
        for (const feature of epic.features) {
          storyCount += feature.userStories.length;
        }
      }
      expect(result.result.totalUserStories).toBe(storyCount);
    });

    it('result includes generatedAt timestamp', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      expect(result.result.generatedAt).toBeDefined();
      expect(new Date(result.result.generatedAt).toISOString()).toBe(result.result.generatedAt);
    });

    it('generates backlog for a minimal concept', () => {
      const result = generateBacklog([minimalConcept]);

      expect(result.success).toBe(true);
      expect(result.result.epics.length).toBe(1);
      expect(result.result.epics[0].features.length).toBeGreaterThan(0);
    });

    it('generates features with at least 3 features per epic', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);
      const epic = result.result.epics[0];
      expect(epic.features.length).toBeGreaterThanOrEqual(3);
    });

    it('generates backlog items with MVP, Next Release, and Future Enhancement tags', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);

      const allTags = new Set();
      for (const epic of result.result.epics) {
        allTags.add(epic.tag);
        for (const feature of epic.features) {
          allTags.add(feature.tag);
          for (const story of feature.userStories) {
            allTags.add(story.tag);
          }
        }
      }

      // At least MVP should be present since core features are tagged MVP
      expect(allTags.has('MVP')).toBe(true);
    });

    it('returns error when concepts is null', () => {
      const result = generateBacklog(null);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
    });

    it('returns error when concepts is not an array', () => {
      const result = generateBacklog('not-an-array');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('returns error when concepts array is empty', () => {
      const result = generateBacklog([]);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('returns error when concept has no name', () => {
      const result = generateBacklog([{ id: 'no-name' }]);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('handles concept with empty string id gracefully', () => {
      const conceptWithEmptyId = { ...validConcept, id: '' };
      const result = generateBacklog([conceptWithEmptyId]);

      expect(result.success).toBe(true);
      expect(result.result.epics.length).toBe(1);
      expect(result.result.epics[0].conceptId).toBe('');
    });

    it('all IDs across the entire backlog are unique', () => {
      const result = generateBacklog([validConcept, secondConcept]);

      expect(result.success).toBe(true);

      const allIds = [];
      for (const epic of result.result.epics) {
        allIds.push(epic.id);
        for (const feature of epic.features) {
          allIds.push(feature.id);
          for (const story of feature.userStories) {
            allIds.push(story.id);
            for (const criterion of story.acceptanceCriteria) {
              allIds.push(criterion.id);
            }
          }
        }
      }

      expect(new Set(allIds).size).toBe(allIds.length);
    });
  });

  // ===========================================================================
  // tagBacklogItem
  // ===========================================================================

  describe('tagBacklogItem', () => {
    const sampleItem = {
      id: 'item-1',
      type: 'feature',
      title: 'Test Feature',
      description: 'A test feature',
      tag: 'MVP',
      status: 'Approved',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('assigns MVP tag correctly', () => {
      const result = tagBacklogItem(sampleItem, 'MVP');

      expect(result.success).toBe(true);
      expect(result.result.tag).toBe('MVP');
    });

    it('assigns Next Release tag correctly', () => {
      const result = tagBacklogItem(sampleItem, 'Next Release');

      expect(result.success).toBe(true);
      expect(result.result.tag).toBe('Next Release');
    });

    it('assigns Future Enhancement tag correctly', () => {
      const result = tagBacklogItem(sampleItem, 'Future Enhancement');

      expect(result.success).toBe(true);
      expect(result.result.tag).toBe('Future Enhancement');
    });

    it('sets default status for MVP tag to Approved', () => {
      const result = tagBacklogItem(sampleItem, 'MVP');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('Approved');
    });

    it('sets default status for Next Release tag to Under Review', () => {
      const result = tagBacklogItem(sampleItem, 'Next Release');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('Under Review');
    });

    it('sets default status for Future Enhancement tag to Idea', () => {
      const result = tagBacklogItem(sampleItem, 'Future Enhancement');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('Idea');
    });

    it('updates the updatedAt timestamp', () => {
      const result = tagBacklogItem(sampleItem, 'Next Release');

      expect(result.success).toBe(true);
      expect(result.result.updatedAt).not.toBe(sampleItem.updatedAt);
      expect(new Date(result.result.updatedAt).toISOString()).toBe(result.result.updatedAt);
    });

    it('preserves other item properties', () => {
      const result = tagBacklogItem(sampleItem, 'Next Release');

      expect(result.success).toBe(true);
      expect(result.result.id).toBe(sampleItem.id);
      expect(result.result.type).toBe(sampleItem.type);
      expect(result.result.title).toBe(sampleItem.title);
      expect(result.result.description).toBe(sampleItem.description);
      expect(result.result.createdAt).toBe(sampleItem.createdAt);
    });

    it('returns a new object (does not mutate original)', () => {
      const result = tagBacklogItem(sampleItem, 'Future Enhancement');

      expect(result.success).toBe(true);
      expect(result.result).not.toBe(sampleItem);
      expect(sampleItem.tag).toBe('MVP');
      expect(sampleItem.status).toBe('Approved');
    });

    it('returns error when item is null', () => {
      const result = tagBacklogItem(null, 'MVP');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('returns error when item is not an object', () => {
      const result = tagBacklogItem('not-an-object', 'MVP');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when tag is null', () => {
      const result = tagBacklogItem(sampleItem, null);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when tag is empty string', () => {
      const result = tagBacklogItem(sampleItem, '');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when tag is invalid', () => {
      const result = tagBacklogItem(sampleItem, 'Invalid Tag');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
      expect(result.error).toContain('Invalid tag');
    });

    it('returns error when tag is not a string', () => {
      const result = tagBacklogItem(sampleItem, 123);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });
  });

  // ===========================================================================
  // updateBacklogItemStatus
  // ===========================================================================

  describe('updateBacklogItemStatus', () => {
    const sampleItem = {
      id: 'item-1',
      type: 'user-story',
      title: 'Test Story',
      tag: 'MVP',
      status: 'Idea',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('updates status to Approved', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Approved');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('Approved');
    });

    it('updates status to In Progress', () => {
      const result = updateBacklogItemStatus(sampleItem, 'In Progress');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('In Progress');
    });

    it('updates status to Completed', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Completed');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('Completed');
    });

    it('updates status to Archived', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Archived');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('Archived');
    });

    it('updates status to Under Review', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Under Review');

      expect(result.success).toBe(true);
      expect(result.result.status).toBe('Under Review');
    });

    it('updates the updatedAt timestamp', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Approved');

      expect(result.success).toBe(true);
      expect(result.result.updatedAt).not.toBe(sampleItem.updatedAt);
    });

    it('preserves other item properties', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Completed');

      expect(result.success).toBe(true);
      expect(result.result.id).toBe(sampleItem.id);
      expect(result.result.type).toBe(sampleItem.type);
      expect(result.result.title).toBe(sampleItem.title);
      expect(result.result.tag).toBe(sampleItem.tag);
    });

    it('returns a new object (does not mutate original)', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Completed');

      expect(result.success).toBe(true);
      expect(result.result).not.toBe(sampleItem);
      expect(sampleItem.status).toBe('Idea');
    });

    it('returns error when item is null', () => {
      const result = updateBacklogItemStatus(null, 'Approved');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when status is null', () => {
      const result = updateBacklogItemStatus(sampleItem, null);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when status is invalid', () => {
      const result = updateBacklogItemStatus(sampleItem, 'Invalid Status');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
      expect(result.error).toContain('Invalid status');
    });

    it('returns error when status is not a string', () => {
      const result = updateBacklogItemStatus(sampleItem, 42);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when status is empty string', () => {
      const result = updateBacklogItemStatus(sampleItem, '');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });
  });

  // ===========================================================================
  // flattenBacklog
  // ===========================================================================

  describe('flattenBacklog', () => {
    it('flattens a structured backlog into a flat array', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const flatResult = flattenBacklog(backlogResult.result.epics);

      expect(flatResult.success).toBe(true);
      expect(Array.isArray(flatResult.result)).toBe(true);
      expect(flatResult.result.length).toBeGreaterThan(0);
    });

    it('flat items include epics, features, and user stories', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const flatResult = flattenBacklog(backlogResult.result.epics);

      expect(flatResult.success).toBe(true);

      const types = new Set(flatResult.result.map((item) => item.type));
      expect(types.has('epic')).toBe(true);
      expect(types.has('feature')).toBe(true);
      expect(types.has('user-story')).toBe(true);
    });

    it('each flat item has required fields', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const flatResult = flattenBacklog(backlogResult.result.epics);

      expect(flatResult.success).toBe(true);

      for (const item of flatResult.result) {
        expect(item.id).toBeDefined();
        expect(item.type).toBeDefined();
        expect(typeof item.title).toBe('string');
        expect(typeof item.tag).toBe('string');
        expect(typeof item.status).toBe('string');
      }
    });

    it('epic items have null parentId and parentType', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const flatResult = flattenBacklog(backlogResult.result.epics);

      expect(flatResult.success).toBe(true);

      const epics = flatResult.result.filter((item) => item.type === 'epic');
      for (const epic of epics) {
        expect(epic.parentId).toBeNull();
        expect(epic.parentType).toBeNull();
      }
    });

    it('feature items have epic as parentType', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const flatResult = flattenBacklog(backlogResult.result.epics);

      expect(flatResult.success).toBe(true);

      const features = flatResult.result.filter((item) => item.type === 'feature');
      for (const feature of features) {
        expect(feature.parentType).toBe('epic');
        expect(feature.parentId).toBeDefined();
      }
    });

    it('user story items have feature as parentType', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const flatResult = flattenBacklog(backlogResult.result.epics);

      expect(flatResult.success).toBe(true);

      const stories = flatResult.result.filter((item) => item.type === 'user-story');
      for (const story of stories) {
        expect(story.parentType).toBe('feature');
        expect(story.parentId).toBeDefined();
      }
    });

    it('total flat items equals epics + features + user stories', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const flatResult = flattenBacklog(backlogResult.result.epics);

      expect(flatResult.success).toBe(true);

      const expectedTotal =
        backlogResult.result.totalEpics +
        backlogResult.result.totalFeatures +
        backlogResult.result.totalUserStories;

      expect(flatResult.result.length).toBe(expectedTotal);
    });

    it('returns error when epics is not an array', () => {
      const result = flattenBacklog('not-an-array');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns empty array for empty epics array', () => {
      const result = flattenBacklog([]);

      expect(result.success).toBe(true);
      expect(result.result).toEqual([]);
    });

    it('handles null items in epics array gracefully', () => {
      const result = flattenBacklog([null, undefined]);

      expect(result.success).toBe(true);
      expect(result.result).toEqual([]);
    });
  });

  // ===========================================================================
  // getBacklogSummary
  // ===========================================================================

  describe('getBacklogSummary', () => {
    it('returns summary with correct counts', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const summaryResult = getBacklogSummary(backlogResult.result);

      expect(summaryResult.success).toBe(true);
      expect(summaryResult.result).not.toBeNull();
      expect(summaryResult.result.totalEpics).toBe(backlogResult.result.totalEpics);
      expect(summaryResult.result.totalFeatures).toBe(backlogResult.result.totalFeatures);
      expect(summaryResult.result.totalUserStories).toBe(backlogResult.result.totalUserStories);
    });

    it('returns summary with totalItems count', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const summaryResult = getBacklogSummary(backlogResult.result);

      expect(summaryResult.success).toBe(true);
      expect(typeof summaryResult.result.totalItems).toBe('number');
      expect(summaryResult.result.totalItems).toBeGreaterThan(0);
    });

    it('returns summary with byTag counts', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const summaryResult = getBacklogSummary(backlogResult.result);

      expect(summaryResult.success).toBe(true);
      expect(summaryResult.result.byTag).toBeDefined();
      expect(typeof summaryResult.result.byTag['MVP']).toBe('number');
      expect(typeof summaryResult.result.byTag['Next Release']).toBe('number');
      expect(typeof summaryResult.result.byTag['Future Enhancement']).toBe('number');
    });

    it('byTag counts sum to totalItems', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const summaryResult = getBacklogSummary(backlogResult.result);

      expect(summaryResult.success).toBe(true);

      const tagSum =
        summaryResult.result.byTag['MVP'] +
        summaryResult.result.byTag['Next Release'] +
        summaryResult.result.byTag['Future Enhancement'];

      expect(tagSum).toBe(summaryResult.result.totalItems);
    });

    it('returns summary with byStatus counts', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const summaryResult = getBacklogSummary(backlogResult.result);

      expect(summaryResult.success).toBe(true);
      expect(summaryResult.result.byStatus).toBeDefined();

      for (const status of BACKLOG_STATUSES) {
        expect(typeof summaryResult.result.byStatus[status]).toBe('number');
      }
    });

    it('returns summary with generatedAt timestamp', () => {
      const backlogResult = generateBacklog([validConcept]);

      expect(backlogResult.success).toBe(true);

      const summaryResult = getBacklogSummary(backlogResult.result);

      expect(summaryResult.success).toBe(true);
      expect(summaryResult.result.generatedAt).toBeDefined();
    });

    it('returns error when backlogResult is null', () => {
      const result = getBacklogSummary(null);

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when backlogResult has no epics array', () => {
      const result = getBacklogSummary({ totalEpics: 0 });

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });

    it('returns error when backlogResult is not an object', () => {
      const result = getBacklogSummary('not-an-object');

      expect(result.success).toBe(false);
      expect(result.result).toBeNull();
    });
  });

  // ===========================================================================
  // Output structure consistency
  // ===========================================================================

  describe('output structure consistency', () => {
    it('generated backlog maintains parent-child relationships', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);

      const epic = result.result.epics[0];

      for (const feature of epic.features) {
        expect(feature.epicId).toBe(epic.id);

        for (const story of feature.userStories) {
          expect(story.featureId).toBe(feature.id);
          expect(story.epicId).toBe(epic.id);
        }
      }
    });

    it('generated backlog for multiple concepts maintains separate hierarchies', () => {
      const result = generateBacklog([validConcept, secondConcept]);

      expect(result.success).toBe(true);
      expect(result.result.epics.length).toBe(2);

      const epic1 = result.result.epics[0];
      const epic2 = result.result.epics[1];

      expect(epic1.id).not.toBe(epic2.id);
      expect(epic1.conceptName).not.toBe(epic2.conceptName);

      for (const feature of epic1.features) {
        expect(feature.epicId).toBe(epic1.id);
        expect(feature.conceptName).toBe(epic1.conceptName);
      }

      for (const feature of epic2.features) {
        expect(feature.epicId).toBe(epic2.id);
        expect(feature.conceptName).toBe(epic2.conceptName);
      }
    });

    it('MVP-tagged items have Approved status by default', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);

      for (const epic of result.result.epics) {
        if (epic.tag === 'MVP') {
          expect(epic.status).toBe('Approved');
        }
        for (const feature of epic.features) {
          if (feature.tag === 'MVP') {
            expect(feature.status).toBe('Approved');
          }
          for (const story of feature.userStories) {
            if (story.tag === 'MVP') {
              expect(story.status).toBe('Approved');
            }
          }
        }
      }
    });

    it('Next Release-tagged items have Under Review status by default', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);

      for (const epic of result.result.epics) {
        for (const feature of epic.features) {
          if (feature.tag === 'Next Release') {
            expect(feature.status).toBe('Under Review');
          }
          for (const story of feature.userStories) {
            if (story.tag === 'Next Release') {
              expect(story.status).toBe('Under Review');
            }
          }
        }
      }
    });

    it('Future Enhancement-tagged items have Idea status by default', () => {
      const result = generateBacklog([validConcept]);

      expect(result.success).toBe(true);

      for (const epic of result.result.epics) {
        for (const feature of epic.features) {
          if (feature.tag === 'Future Enhancement') {
            expect(feature.status).toBe('Idea');
          }
          for (const story of feature.userStories) {
            if (story.tag === 'Future Enhancement') {
              expect(story.status).toBe('Idea');
            }
          }
        }
      }
    });
  });

  // ===========================================================================
  // End-to-end integration
  // ===========================================================================

  describe('end-to-end integration', () => {
    it('full pipeline: generate, flatten, summarize', () => {
      const concepts = [validConcept, secondConcept];

      const backlogResult = generateBacklog(concepts);
      expect(backlogResult.success).toBe(true);
      expect(backlogResult.result.totalEpics).toBe(2);

      const flatResult = flattenBacklog(backlogResult.result.epics);
      expect(flatResult.success).toBe(true);
      expect(flatResult.result.length).toBeGreaterThan(0);

      const summaryResult = getBacklogSummary(backlogResult.result);
      expect(summaryResult.success).toBe(true);
      expect(summaryResult.result.totalEpics).toBe(2);
      expect(summaryResult.result.totalItems).toBe(flatResult.result.length);
    });

    it('tag and status updates work on generated items', () => {
      const backlogResult = generateBacklog([validConcept]);
      expect(backlogResult.success).toBe(true);

      const feature = backlogResult.result.epics[0].features[0];

      const tagResult = tagBacklogItem(feature, 'Future Enhancement');
      expect(tagResult.success).toBe(true);
      expect(tagResult.result.tag).toBe('Future Enhancement');
      expect(tagResult.result.status).toBe('Idea');

      const statusResult = updateBacklogItemStatus(tagResult.result, 'In Progress');
      expect(statusResult.success).toBe(true);
      expect(statusResult.result.status).toBe('In Progress');
      expect(statusResult.result.tag).toBe('Future Enhancement');
    });

    it('user story descriptions follow "As a... I want... So that..." pattern', () => {
      const result = generateBacklog([validConcept]);
      expect(result.success).toBe(true);

      let foundPattern = false;
      for (const epic of result.result.epics) {
        for (const feature of epic.features) {
          for (const story of feature.userStories) {
            if (story.description.toLowerCase().includes('as a') && story.description.toLowerCase().includes('i want')) {
              foundPattern = true;
            }
          }
        }
      }
      expect(foundPattern).toBe(true);
    });

    it('feature descriptions reference the concept name', () => {
      const result = generateBacklog([validConcept]);
      expect(result.success).toBe(true);

      let foundReference = false;
      for (const feature of result.result.epics[0].features) {
        if (feature.description.includes(validConcept.name) || feature.title.includes(validConcept.name)) {
          foundReference = true;
        }
      }
      expect(foundReference).toBe(true);
    });
  });
});