import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { classNames, formatDate, formatTimestamp } from '../utils/helpers.js';
import { generateOpportunityStatement } from '../services/opportunityGenerator.js';
import { generatePersona } from '../services/personaGenerator.js';
import { generateConceptShortlist } from '../services/conceptGenerator.js';
import { evaluateConcepts } from '../services/conceptEvaluator.js';
import { generateBacklog } from '../services/backlogGenerator.js';
import { generatePitchSummary } from '../services/pitchSummaryGenerator.js';
import { regenerateOutput } from '../services/editRegenerateService.js';
import StepIndicator from '../components/common/StepIndicator.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ExportMenu from '../components/common/ExportMenu.jsx';
import EditDialog from '../components/common/EditDialog.jsx';
import OpportunityStatement from '../components/workspace/OpportunityStatement.jsx';
import PersonaCard from '../components/workspace/PersonaCard.jsx';
import AssumptionsRisks from '../components/workspace/AssumptionsRisks.jsx';
import ConceptShortlist from '../components/concepts/ConceptShortlist.jsx';
import MatrixTable from '../components/matrix/MatrixTable.jsx';
import ScoringRationale from '../components/matrix/ScoringRationale.jsx';
import ScoringConfigPanel from '../components/matrix/ScoringConfigPanel.jsx';
import BacklogList from '../components/backlog/BacklogList.jsx';
import ExecutiveSummary from '../components/pitch/ExecutiveSummary.jsx';

/**
 * Chevron right icon SVG component for breadcrumb separator.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The chevron right icon SVG element.
 */
const ChevronRightIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Home icon SVG component for breadcrumb.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The home icon SVG element.
 */
const HomeIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Region icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The region icon SVG element.
 */
const RegionIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145c.186-.1.429-.24.718-.427.58-.375 1.348-.956 2.118-1.72 1.542-1.528 3.047-3.848 3.047-6.88 0-3.866-3.134-7-7-7s-7 3.134-7 7c0 3.032 1.505 5.352 3.047 6.88a13.67 13.67 0 002.118 1.72 8.72 8.72 0 00.718.427 5.74 5.74 0 00.281.145l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Segment icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The segment icon SVG element.
 */
const SegmentIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
  </svg>
);

/**
 * Trend icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The trend icon SVG element.
 */
const TrendIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Goal icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The goal icon SVG element.
 */
const GoalIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 1a.75.75 0 01.75.75v1.5a6.5 6.5 0 015.5 5.5h1.5a.75.75 0 010 1.5h-1.5a6.5 6.5 0 01-5.5 5.5v1.5a.75.75 0 01-1.5 0v-1.5a6.5 6.5 0 01-5.5-5.5H2.25a.75.75 0 010-1.5h1.5a6.5 6.5 0 015.5-5.5v-1.5A.75.75 0 0110 1zm0 4a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 100 6 3 3 0 000-6z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Delete icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The delete icon SVG element.
 */
const DeleteIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Determine the current workflow step index based on workspace data completeness.
 * @param {object} workspace - The workspace data object.
 * @returns {number} The current step index (0-4).
 */
const determineCurrentStep = (workspace) => {
  if (!workspace) {
    return 0;
  }

  const hasPitchSummary =
    (typeof workspace.pitchSummary === 'string' && workspace.pitchSummary.trim().length > 0) ||
    (workspace.pitchSummary && typeof workspace.pitchSummary === 'object' && workspace.pitchSummary.title);

  const hasBacklog = Array.isArray(workspace.backlog) && workspace.backlog.length > 0;
  const hasScoring = Array.isArray(workspace.scoring) && workspace.scoring.length > 0;
  const hasConcepts = Array.isArray(workspace.concepts) && workspace.concepts.length > 0;
  const hasOpportunity =
    typeof workspace.opportunityStatement === 'string' && workspace.opportunityStatement.trim().length > 0;
  const hasPersona = workspace.persona !== null && typeof workspace.persona === 'object' && !!workspace.persona.name;

  if (hasPitchSummary) {
    return 4;
  }
  if (hasBacklog) {
    return 3;
  }
  if (hasScoring || hasConcepts) {
    return 2;
  }
  if (hasOpportunity || hasPersona) {
    return 1;
  }
  return 0;
};

/**
 * WorkspaceDetailPage component renders the full workspace detail view with
 * tabbed/sectioned layout showing all workspace outputs. Coordinates generation
 * services and updates workspace via context. Shows loading states during generation.
 *
 * @returns {React.ReactElement} The workspace detail page element.
 */
const WorkspaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentWorkspace,
    selectWorkspace,
    setCurrentWorkspace,
    deleteWorkspace,
    loading: contextLoading,
    error: contextError,
  } = useWorkspace();
  const { addSuccess, addError, addWarning } = useNotification();

  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [isGeneratingOpportunity, setIsGeneratingOpportunity] = useState(false);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState(false);
  const [isGeneratingScoring, setIsGeneratingScoring] = useState(false);
  const [isGeneratingBacklog, setIsGeneratingBacklog] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [selectedConceptIds, setSelectedConceptIds] = useState([]);
  const [selectedScoredConcept, setSelectedScoredConcept] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogType, setEditDialogType] = useState('opportunityStatement');
  const [editDialogData, setEditDialogData] = useState(null);
  const [reviewerComment, setReviewerComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const workspace = currentWorkspace;

  /**
   * Load workspace on mount or when ID changes.
   */
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    setIsLoadingWorkspace(true);
    const result = selectWorkspace(id);

    if (!result.success || !result.workspace) {
      addError(result.error || 'Workspace not found.');
      navigate('/');
      return;
    }

    if (Array.isArray(result.workspace.selectedConcepts)) {
      setSelectedConceptIds(result.workspace.selectedConcepts);
    }

    setIsLoadingWorkspace(false);
  }, [id, selectWorkspace, navigate, addError]);

  /**
   * Sync selected concepts from workspace.
   */
  useEffect(() => {
    if (workspace && Array.isArray(workspace.selectedConcepts)) {
      setSelectedConceptIds(workspace.selectedConcepts);
    }
  }, [workspace]);

  const currentStep = useMemo(() => {
    return determineCurrentStep(workspace);
  }, [workspace]);

  const workspaceContext = useMemo(() => {
    if (!workspace) {
      return { region: '', segment: '', trend: '', goal: '' };
    }
    return {
      region: workspace.region || '',
      segment: workspace.segment || '',
      trend: workspace.trend || '',
      goal: workspace.goal || '',
    };
  }, [workspace]);

  /**
   * Helper to update workspace and persist.
   * @param {object} updates - The updates to apply.
   */
  const updateWorkspaceData = useCallback(
    (updates) => {
      if (!workspace) {
        return;
      }
      const updatedWorkspace = {
        ...workspace,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setCurrentWorkspace(updatedWorkspace);
    },
    [workspace, setCurrentWorkspace],
  );

  // =========================================================================
  // Opportunity Statement Handlers
  // =========================================================================

  const handleGenerateOpportunity = useCallback(() => {
    if (!workspace) {
      return;
    }
    setIsGeneratingOpportunity(true);

    try {
      const result = generateOpportunityStatement(workspaceContext);

      if (!result.success || !result.result) {
        addError(result.error || 'Failed to generate opportunity statement.');
        setIsGeneratingOpportunity(false);
        return;
      }

      updateWorkspaceData({
        opportunityStatement: result.result.statement,
      });

      addSuccess('Opportunity statement generated successfully.');
    } catch (err) {
      console.error('[WorkspaceDetailPage] handleGenerateOpportunity failed:', err);
      addError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingOpportunity(false);
    }
  }, [workspace, workspaceContext, updateWorkspaceData, addSuccess, addError]);

  const handleEditOpportunity = useCallback(
    (newStatement) => {
      updateWorkspaceData({ opportunityStatement: newStatement });
      addSuccess('Opportunity statement updated.');
    },
    [updateWorkspaceData, addSuccess],
  );

  // =========================================================================
  // Persona Handlers
  // =========================================================================

  const handleGeneratePersona = useCallback(() => {
    if (!workspace) {
      return;
    }
    setIsGeneratingPersona(true);

    try {
      const result = generatePersona(workspaceContext);

      if (!result.success || !result.result) {
        addError(result.error || 'Failed to generate persona.');
        setIsGeneratingPersona(false);
        return;
      }

      updateWorkspaceData({ persona: result.result });
      addSuccess('Persona generated successfully.');
    } catch (err) {
      console.error('[WorkspaceDetailPage] handleGeneratePersona failed:', err);
      addError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingPersona(false);
    }
  }, [workspace, workspaceContext, updateWorkspaceData, addSuccess, addError]);

  const handleEditPersona = useCallback(
    (updatedPersona) => {
      updateWorkspaceData({ persona: updatedPersona });
      addSuccess('Persona updated.');
    },
    [updateWorkspaceData, addSuccess],
  );

  // =========================================================================
  // Concept Handlers
  // =========================================================================

  const handleGenerateConcepts = useCallback(() => {
    if (!workspace) {
      return;
    }
    setIsGeneratingConcepts(true);

    try {
      const result = generateConceptShortlist(workspaceContext, 4);

      if (!result.success || !result.results || result.results.length === 0) {
        addError(result.error || 'Failed to generate concepts.');
        setIsGeneratingConcepts(false);
        return;
      }

      updateWorkspaceData({
        concepts: result.results,
        selectedConcepts: [],
        scoring: [],
      });

      setSelectedConceptIds([]);
      addSuccess(`${result.results.length} concepts generated successfully.`);
    } catch (err) {
      console.error('[WorkspaceDetailPage] handleGenerateConcepts failed:', err);
      addError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingConcepts(false);
    }
  }, [workspace, workspaceContext, updateWorkspaceData, addSuccess, addError]);

  const handleConceptSelect = useCallback(
    (conceptId, isSelected) => {
      setSelectedConceptIds((prev) => {
        let updated;
        if (isSelected) {
          updated = [...prev, conceptId];
        } else {
          updated = prev.filter((cid) => cid !== conceptId);
        }
        updateWorkspaceData({ selectedConcepts: updated });
        return updated;
      });
    },
    [updateWorkspaceData],
  );

  const handleSelectAllConcepts = useCallback(() => {
    if (!workspace || !Array.isArray(workspace.concepts)) {
      return;
    }
    const allIds = workspace.concepts.map((c) => c.id || c.name);
    setSelectedConceptIds(allIds);
    updateWorkspaceData({ selectedConcepts: allIds });
  }, [workspace, updateWorkspaceData]);

  const handleDeselectAllConcepts = useCallback(() => {
    setSelectedConceptIds([]);
    updateWorkspaceData({ selectedConcepts: [] });
  }, [updateWorkspaceData]);

  const handleEditConcept = useCallback(
    (concept) => {
      setEditDialogType('concept');
      setEditDialogData(concept);
      setEditDialogOpen(true);
    },
    [],
  );

  const handleEditConceptSave = useCallback(
    (updatedConcept) => {
      if (!workspace || !Array.isArray(workspace.concepts)) {
        return;
      }
      const updatedConcepts = workspace.concepts.map((c) => {
        if ((c.id && c.id === updatedConcept.id) || (c.name && c.name === updatedConcept.name)) {
          return { ...c, ...updatedConcept };
        }
        return c;
      });
      updateWorkspaceData({ concepts: updatedConcepts });
    },
    [workspace, updateWorkspaceData],
  );

  // =========================================================================
  // Scoring Handlers
  // =========================================================================

  const handleGenerateScoring = useCallback(() => {
    if (!workspace || !Array.isArray(workspace.concepts) || workspace.concepts.length === 0) {
      addWarning('Generate concepts first before scoring.');
      return;
    }
    setIsGeneratingScoring(true);

    try {
      const result = evaluateConcepts(workspace.concepts);

      if (!result.success || !result.results || result.results.length === 0) {
        addError(result.error || 'Failed to score concepts.');
        setIsGeneratingScoring(false);
        return;
      }

      updateWorkspaceData({ scoring: result.results });
      addSuccess(`${result.results.length} concepts scored and ranked.`);

      if (result.results.length > 0) {
        setSelectedScoredConcept(result.results[0]);
      }
    } catch (err) {
      console.error('[WorkspaceDetailPage] handleGenerateScoring failed:', err);
      addError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingScoring(false);
    }
  }, [workspace, updateWorkspaceData, addSuccess, addError, addWarning]);

  const handleConceptRowClick = useCallback((concept) => {
    setSelectedScoredConcept(concept);
  }, []);

  // =========================================================================
  // Backlog Handlers
  // =========================================================================

  const handleGenerateBacklog = useCallback(() => {
    if (!workspace) {
      return;
    }

    let conceptsForBacklog = [];

    if (selectedConceptIds.length > 0 && Array.isArray(workspace.concepts)) {
      conceptsForBacklog = workspace.concepts.filter(
        (c) => selectedConceptIds.includes(c.id) || selectedConceptIds.includes(c.name),
      );
    }

    if (conceptsForBacklog.length === 0 && Array.isArray(workspace.concepts)) {
      conceptsForBacklog = workspace.concepts;
    }

    if (conceptsForBacklog.length === 0) {
      addWarning('Generate and select concepts first before generating a backlog.');
      return;
    }

    setIsGeneratingBacklog(true);

    try {
      const result = generateBacklog(conceptsForBacklog);

      if (!result.success || !result.result) {
        addError(result.error || 'Failed to generate backlog.');
        setIsGeneratingBacklog(false);
        return;
      }

      updateWorkspaceData({ backlog: result.result.epics || [] });
      addSuccess(
        `Backlog generated: ${result.result.totalEpics} epics, ${result.result.totalFeatures} features, ${result.result.totalUserStories} user stories.`,
      );
    } catch (err) {
      console.error('[WorkspaceDetailPage] handleGenerateBacklog failed:', err);
      addError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingBacklog(false);
    }
  }, [workspace, selectedConceptIds, updateWorkspaceData, addSuccess, addError, addWarning]);

  const handleBacklogEdit = useCallback(
    (updatedItem) => {
      if (!workspace || !Array.isArray(workspace.backlog)) {
        return;
      }

      const updateEpics = (epics) => {
        return epics.map((epic) => {
          if (epic.id === updatedItem.id) {
            return { ...epic, ...updatedItem };
          }

          if (Array.isArray(epic.features)) {
            const updatedFeatures = epic.features.map((feature) => {
              if (feature.id === updatedItem.id) {
                return { ...feature, ...updatedItem };
              }

              if (Array.isArray(feature.userStories)) {
                const updatedStories = feature.userStories.map((story) => {
                  if (story.id === updatedItem.id) {
                    return { ...story, ...updatedItem };
                  }
                  return story;
                });
                return { ...feature, userStories: updatedStories };
              }

              return feature;
            });
            return { ...epic, features: updatedFeatures };
          }

          return epic;
        });
      };

      const updatedBacklog = updateEpics(workspace.backlog);
      updateWorkspaceData({ backlog: updatedBacklog });
    },
    [workspace, updateWorkspaceData],
  );

  const handleBacklogTagChange = useCallback(
    (itemId, newTag) => {
      handleBacklogEdit({ id: itemId, tag: newTag, updatedAt: new Date().toISOString() });
    },
    [handleBacklogEdit],
  );

  const handleBacklogStatusChange = useCallback(
    (itemId, newStatus) => {
      handleBacklogEdit({ id: itemId, status: newStatus, updatedAt: new Date().toISOString() });
    },
    [handleBacklogEdit],
  );

  // =========================================================================
  // Executive Summary Handlers
  // =========================================================================

  const handleGenerateSummary = useCallback(() => {
    if (!workspace) {
      return;
    }
    setIsGeneratingSummary(true);

    try {
      let recommendedConcept = null;
      let scoredConcept = null;
      const allScoredConcepts = Array.isArray(workspace.scoring) ? workspace.scoring : [];

      if (selectedConceptIds.length > 0 && Array.isArray(workspace.concepts)) {
        recommendedConcept =
          workspace.concepts.find(
            (c) => selectedConceptIds.includes(c.id) || selectedConceptIds.includes(c.name),
          ) || null;
      }

      if (!recommendedConcept && Array.isArray(workspace.concepts) && workspace.concepts.length > 0) {
        recommendedConcept = workspace.concepts[0];
      }

      if (recommendedConcept && allScoredConcepts.length > 0) {
        scoredConcept =
          allScoredConcepts.find(
            (sc) => sc.name === recommendedConcept.name || sc.id === recommendedConcept.id,
          ) ||
          allScoredConcepts[0] ||
          null;
      }

      const result = generatePitchSummary(workspace, {
        recommendedConcept,
        scoredConcept,
        allScoredConcepts,
      });

      if (!result.success || !result.result) {
        addError(result.error || 'Failed to generate executive summary.');
        setIsGeneratingSummary(false);
        return;
      }

      updateWorkspaceData({
        pitchSummary: result.result,
        assumptions: result.result.assumptions || workspace.assumptions || [],
        risks: result.result.keyRisks || workspace.risks || [],
      });

      addSuccess('Executive summary generated successfully.');
    } catch (err) {
      console.error('[WorkspaceDetailPage] handleGenerateSummary failed:', err);
      addError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [workspace, selectedConceptIds, updateWorkspaceData, addSuccess, addError]);

  const handleCommentChange = useCallback(
    (comment) => {
      setReviewerComment(comment);
    },
    [],
  );

  // =========================================================================
  // Assumptions & Risks Handlers
  // =========================================================================

  const handleAssumptionsRisksChange = useCallback(
    ({ assumptions, risks, missingInfo }) => {
      const updates = {};
      if (assumptions !== undefined) {
        updates.assumptions = assumptions;
      }
      if (risks !== undefined) {
        updates.risks = risks;
      }
      if (missingInfo !== undefined) {
        updates.missingInfo = missingInfo;
      }
      updateWorkspaceData(updates);
    },
    [updateWorkspaceData],
  );

  // =========================================================================
  // Edit Dialog Handlers
  // =========================================================================

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
    setEditDialogData(null);
  }, []);

  const handleEditDialogSave = useCallback(
    (payload) => {
      if (editDialogType === 'concept') {
        handleEditConceptSave(payload);
      } else if (editDialogType === 'pitchSummary') {
        updateWorkspaceData({ pitchSummary: payload });
      }
      setEditDialogOpen(false);
      setEditDialogData(null);
    },
    [editDialogType, handleEditConceptSave, updateWorkspaceData],
  );

  // =========================================================================
  // Delete Workspace Handler
  // =========================================================================

  const handleDeleteWorkspace = useCallback(() => {
    if (!workspace) {
      return;
    }

    const result = deleteWorkspace(workspace.id);

    if (!result.success) {
      addError(result.error || 'Failed to delete workspace.');
      return;
    }

    addSuccess('Workspace deleted successfully.');
    navigate('/');
  }, [workspace, deleteWorkspace, addSuccess, addError, navigate]);

  // =========================================================================
  // Export Handlers
  // =========================================================================

  const handleExportBacklog = useCallback(() => {
    // ExportMenu handles this via workspaceId
  }, []);

  // =========================================================================
  // Scoring Config Handler
  // =========================================================================

  const handleScoringConfigSave = useCallback(
    (_config) => {
      if (workspace && Array.isArray(workspace.concepts) && workspace.concepts.length > 0) {
        addWarning('Scoring weights updated. Re-score concepts to apply new weights.');
      }
    },
    [workspace, addWarning],
  );

  // =========================================================================
  // Render
  // =========================================================================

  if (isLoadingWorkspace || contextLoading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSpinner
          size="md"
          color="brand"
          message="Loading workspace..."
          className="py-16"
        />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          title="Workspace Not Found"
          message="The workspace you are looking for does not exist or has been deleted."
          actionLabel="Back to Dashboard"
          onAction={() => navigate('/')}
          actionVariant="primary"
          size="lg"
          bordered
        />
      </div>
    );
  }

  const hasOpportunity =
    typeof workspace.opportunityStatement === 'string' &&
    workspace.opportunityStatement.trim().length > 0;
  const hasPersona =
    workspace.persona !== null &&
    typeof workspace.persona === 'object' &&
    !!workspace.persona.name;
  const hasConcepts = Array.isArray(workspace.concepts) && workspace.concepts.length > 0;
  const hasScoring = Array.isArray(workspace.scoring) && workspace.scoring.length > 0;
  const hasBacklog = Array.isArray(workspace.backlog) && workspace.backlog.length > 0;
  const hasPitchSummary =
    (typeof workspace.pitchSummary === 'string' && workspace.pitchSummary.trim().length > 0) ||
    (workspace.pitchSummary &&
      typeof workspace.pitchSummary === 'object' &&
      workspace.pitchSummary.title);

  const summaryData =
    workspace.pitchSummary && typeof workspace.pitchSummary === 'object'
      ? workspace.pitchSummary
      : null;

  const formattedCreatedAt = workspace.createdAt ? formatDate(workspace.createdAt) : '';
  const formattedUpdatedAt = workspace.updatedAt ? formatTimestamp(workspace.updatedAt) : '';

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
        <Link
          to="/"
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-brand-600 transition-colors duration-200"
        >
          <HomeIcon className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300" />
        <Link
          to="/"
          className="text-xs text-neutral-500 hover:text-brand-600 transition-colors duration-200"
        >
          Workspaces
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-neutral-300" />
        <span className="text-xs font-medium text-neutral-900 truncate max-w-[12rem]">
          {workspace.name || 'Untitled Workspace'}
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-heading font-bold text-neutral-900 leading-tight truncate">
                {workspace.name || 'Untitled Workspace'}
              </h1>
              {/* <Badge label="Prototype" variant="warning" size="sm" rounded bordered /> */}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {formattedCreatedAt && (
                <span className="text-xs text-neutral-400">Created {formattedCreatedAt}</span>
              )}
              {formattedUpdatedAt && (
                <span className="text-xs text-neutral-400">Updated {formattedUpdatedAt}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <ExportMenu
              workspaceId={workspace.id}
              outputType="workspace"
              buttonVariant="secondary"
              buttonSize="sm"
              buttonLabel="Export"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              ariaLabel="Delete workspace"
              iconLeft={<DeleteIcon className="h-3.5 w-3.5" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Workspace Metadata */}
        <div className="flex flex-wrap items-center gap-3">
          {workspace.region && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <RegionIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>{workspace.region}</span>
            </div>
          )}
          {workspace.segment && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <SegmentIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>{workspace.segment}</span>
            </div>
          )}
          {workspace.trend && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <TrendIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>{workspace.trend}</span>
            </div>
          )}
          {workspace.goal && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <GoalIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>{workspace.goal}</span>
            </div>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        size="md"
        orientation="horizontal"
        showLabels
        compact={false}
        className="w-full"
        ariaLabel="Workspace workflow progress"
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="flex items-center justify-between gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <div className="flex flex-col gap-0.5 min-w-0">
            <h4 className="text-sm font-semibold text-red-800">Delete Workspace?</h4>
            <p className="text-xs text-red-700">
              This action cannot be undone. All workspace data will be permanently removed.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteWorkspace}
              type="button"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* Section 1: Opportunity Statement */}
      {/* ================================================================= */}
      <section aria-label="Opportunity Statement" className="flex flex-col gap-3">
        <OpportunityStatement
          statement={workspace.opportunityStatement || ''}
          confidence={hasOpportunity ? 'medium' : 'low'}
          generatedAt={workspace.updatedAt || ''}
          isLoading={isGeneratingOpportunity}
          onRegenerate={handleGenerateOpportunity}
          onEdit={handleEditOpportunity}
        />
      </section>

      {/* ================================================================= */}
      {/* Section 2: Persona */}
      {/* ================================================================= */}
      <section aria-label="Persona" className="flex flex-col gap-3">
        <PersonaCard
          persona={workspace.persona || null}
          confidence={hasPersona ? 'medium' : 'low'}
          isLoading={isGeneratingPersona}
          onRegenerate={handleGeneratePersona}
          onEdit={handleEditPersona}
        />
      </section>

      {/* ================================================================= */}
      {/* Section 3: Concept Shortlist */}
      {/* ================================================================= */}
      <section aria-label="Concept Shortlist" className="flex flex-col gap-3">
        <ConceptShortlist
          concepts={workspace.concepts || []}
          selectedConceptIds={selectedConceptIds}
          onSelect={handleConceptSelect}
          onSelectAll={handleSelectAllConcepts}
          onDeselectAll={handleDeselectAllConcepts}
          onEdit={handleEditConcept}
          onRegenerate={handleGenerateConcepts}
          onGenerateBacklog={handleGenerateBacklog}
          isLoading={isGeneratingConcepts}
          isRegenerating={false}
          showScore={hasScoring}
          showConfidence={hasScoring}
          showRank={hasScoring}
        />
      </section>

      {/* ================================================================= */}
      {/* Section 4: Feasibility Matrix & Scoring */}
      {/* ================================================================= */}
      {hasConcepts && (
        <section aria-label="Feasibility Matrix" className="flex flex-col gap-4">
          {/* Scoring Config Panel */}
          <ScoringConfigPanel
            onSave={handleScoringConfigSave}
            defaultCollapsed
          />

          {/* Generate Scoring Button (if no scoring yet) */}
          {!hasScoring && !isGeneratingScoring && (
            <Card elevation="sm" padding="md" ariaLabel="Generate scoring">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
                    Feasibility &amp; Value Matrix
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Score and rank your concepts against weighted evaluation criteria.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateScoring}
                  ariaLabel="Generate scoring"
                >
                  Score Concepts
                </Button>
              </div>
            </Card>
          )}

          {/* Matrix Table */}
          <MatrixTable
            scoredConcepts={workspace.scoring || []}
            isLoading={isGeneratingScoring}
            onConceptClick={handleConceptRowClick}
            onRegenerate={handleGenerateScoring}
            showRank
            showConfidence
          />

          {/* Scoring Rationale */}
          {hasScoring && (
            <ScoringRationale
              scoredConcept={selectedScoredConcept || (workspace.scoring && workspace.scoring[0]) || null}
              defaultExpanded={false}
              showStrengthsWeaknesses
              showAssumptionsRisks
              showMissingInfo
              showEvidenceNotes
            />
          )}
        </section>
      )}

      {/* ================================================================= */}
      {/* Section 5: Product Backlog */}
      {/* ================================================================= */}
      <section aria-label="Product Backlog" className="flex flex-col gap-3">
        <BacklogList
          epics={workspace.backlog || []}
          isLoading={isGeneratingBacklog}
          isRegenerating={false}
          onRegenerate={handleGenerateBacklog}
          onExport={handleExportBacklog}
          onEdit={handleBacklogEdit}
          onTagChange={handleBacklogTagChange}
          onStatusChange={handleBacklogStatusChange}
          showExport={hasBacklog}
          showRegenerate
          defaultExpanded={false}
        />
      </section>

      {/* ================================================================= */}
      {/* Section 6: Executive Summary */}
      {/* ================================================================= */}
      <section aria-label="Executive Summary" className="flex flex-col gap-3">
        <ExecutiveSummary
          summary={summaryData}
          isLoading={isGeneratingSummary}
          isRegenerating={false}
          onRegenerate={handleGenerateSummary}
          onCommentChange={handleCommentChange}
          reviewerComment={reviewerComment}
        />
      </section>

      {/* ================================================================= */}
      {/* Section 7: Assumptions, Risks & Missing Info */}
      {/* ================================================================= */}
      <section aria-label="Assumptions and Risks" className="flex flex-col gap-3">
        <AssumptionsRisks
          assumptions={Array.isArray(workspace.assumptions) ? workspace.assumptions : []}
          risks={Array.isArray(workspace.risks) ? workspace.risks : []}
          missingInfo={Array.isArray(workspace.missingInfo) ? workspace.missingInfo : []}
          onChange={handleAssumptionsRisksChange}
          updatedAt={workspace.updatedAt || ''}
          defaultExpanded={false}
        />
      </section>

      {/* Edit Dialog */}
      {editDialogOpen && (
        <EditDialog
          isOpen={editDialogOpen}
          onClose={handleEditDialogClose}
          outputType={editDialogType}
          data={editDialogData}
          workspaceId={workspace.id}
          onSave={handleEditDialogSave}
        />
      )}
    </div>
  );
};

WorkspaceDetailPage.displayName = 'WorkspaceDetailPage';

export default WorkspaceDetailPage;