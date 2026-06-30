import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import ScoringConfigPanel from '../components/matrix/ScoringConfigPanel.jsx';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

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
 * Settings icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The settings icon SVG element.
 */
const SettingsIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Info icon SVG component.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The info icon SVG element.
 */
const InfoIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Scale icon SVG component for the how it works section.
 *
 * @param {{ className: string }} props - Component props.
 * @returns {React.ReactElement} The scale icon SVG element.
 */
const ScaleIcon = ({ className }) => (
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
 * ScoringConfigPage component renders the scoring configuration page.
 * Displays a breadcrumb navigation, explanatory text about how scoring weights
 * affect concept ranking, and the ScoringConfigPanel for adjusting weights.
 * Labeled as an admin/demo feature with prototype disclaimer.
 *
 * @returns {React.ReactElement} The scoring configuration page element.
 */
const ScoringConfigPage = () => {
  const { addSuccess, addInfo } = useNotification();

  /**
   * Handle successful scoring config save.
   * @param {object} config - The saved scoring configuration object.
   */
  const handleSave = useCallback(
    (config) => {
      addSuccess('Scoring configuration saved. Re-score your concepts to apply the new weights.');
    },
    [addSuccess],
  );

  /**
   * Handle scoring config reset to defaults.
   * @param {object} config - The default scoring configuration object.
   */
  const handleReset = useCallback(
    (config) => {
      addInfo('Scoring configuration reset to default weights.');
    },
    [addInfo],
  );

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
        <span className="text-xs font-medium text-neutral-900">
          Scoring Configuration
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SettingsIcon className="h-5 w-5 text-brand-600 shrink-0" />
            <h1 className="text-xl font-heading font-bold text-neutral-900 leading-tight">
              Scoring Configuration
            </h1>
            <Badge
              label="Admin / Demo"
              variant="purple"
              size="sm"
              rounded
              bordered
            />
            <Badge
              label="Prototype"
              variant="warning"
              size="sm"
              rounded
              bordered
            />
          </div>
          <p className="text-sm text-neutral-500">
            Configure the relative importance of each scoring criterion used to evaluate and rank
            product innovation concepts.
          </p>
        </div>
      </div>

      {/* Prototype Disclaimer Banner */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <svg
          className="h-4 w-4 text-amber-500 shrink-0 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-semibold text-amber-800">
            Prototype Feature — Demo Only
          </h4>
          <p className="text-2xs text-amber-700 leading-relaxed">
            This scoring configuration page is a demonstration feature. Changes are saved locally
            in your browser and affect how concepts are scored and ranked in the feasibility matrix.
            In a production system, scoring weights would be managed by authorized administrators
            with audit logging and version control.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <Card
        elevation="sm"
        padding="md"
        divided
        header={
          <div className="flex items-center gap-2 min-w-0">
            <ScaleIcon className="h-4 w-4 text-brand-500 shrink-0" />
            <h2 className="text-sm font-heading font-semibold text-neutral-900 leading-tight">
              How Scoring Weights Work
            </h2>
          </div>
        }
        ariaLabel="How scoring weights work"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Scoring weights determine the relative importance of each evaluation criterion when
            calculating the weighted total score for product concepts. The weighted total is used
            to rank concepts in the feasibility and value matrix, helping you identify the most
            promising innovation opportunities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-2xs font-bold select-none mt-0.5">
                1
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h4 className="text-xs font-semibold text-neutral-900">Set Weights</h4>
                <p className="text-2xs text-neutral-500 leading-relaxed">
                  Adjust the percentage weight for each criterion. Weights must sum to 100%.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-2xs font-bold select-none mt-0.5">
                2
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h4 className="text-xs font-semibold text-neutral-900">Score Concepts</h4>
                <p className="text-2xs text-neutral-500 leading-relaxed">
                  Each concept receives a score (1–10) for every criterion during evaluation.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-2xs font-bold select-none mt-0.5">
                3
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h4 className="text-xs font-semibold text-neutral-900">Rank by Total</h4>
                <p className="text-2xs text-neutral-500 leading-relaxed">
                  The weighted total (score × weight, summed) determines concept ranking.
                </p>
              </div>
            </div>
          </div>

          {/* Formula Explanation */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
            <InfoIcon className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-semibold text-blue-800">
                Weighted Total Formula
              </h4>
              <p className="text-2xs text-blue-700 leading-relaxed font-mono">
                Weighted Total = Σ (Criterion Score × Criterion Weight)
              </p>
              <p className="text-2xs text-blue-600 leading-relaxed">
                For example, if Business Value has a weight of 20% and a concept scores 8/10 on
                Business Value, that criterion contributes 8 × 0.20 = 1.60 to the weighted total.
                Higher weights mean that criterion has more influence on the final ranking.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Scoring Config Panel */}
      <ScoringConfigPanel
        onSave={handleSave}
        onReset={handleReset}
        readOnly={false}
        defaultCollapsed={false}
      />

      {/* Additional Context */}
      <Card
        elevation="flat"
        padding="md"
        className="bg-neutral-50 border border-neutral-200"
        ariaLabel="Scoring configuration tips"
      >
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
            Tips for Configuring Weights
          </h3>
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
              <span
                className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400"
                aria-hidden="true"
              />
              <span>
                <strong className="text-neutral-700">Align with strategy:</strong> Increase the
                weight of criteria that matter most to your current strategic objectives. For
                example, if sustainability leadership is a priority, increase the Sustainability
                Fit weight.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
              <span
                className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400"
                aria-hidden="true"
              />
              <span>
                <strong className="text-neutral-700">Balance feasibility and value:</strong>{' '}
                Avoid over-weighting a single criterion. A balanced configuration ensures concepts
                are evaluated holistically across multiple dimensions.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
              <span
                className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400"
                aria-hidden="true"
              />
              <span>
                <strong className="text-neutral-700">Re-score after changes:</strong> After
                updating weights, navigate to a workspace and re-score your concepts to see the
                updated rankings in the feasibility matrix.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
              <span
                className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400"
                aria-hidden="true"
              />
              <span>
                <strong className="text-neutral-700">Use defaults as a starting point:</strong>{' '}
                The default weights provide a balanced evaluation framework. Reset to defaults at
                any time if your custom configuration produces unexpected results.
              </span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Footer Disclaimer */}
      <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
        <p className="text-2xs text-neutral-400 leading-relaxed">
          Scoring configuration is stored locally in your browser. Changes persist across sessions
          but will be lost if you clear browser storage. This is a prototype demonstration feature.
        </p>
        <Badge
          label="Prototype"
          variant="warning"
          size="sm"
          rounded
          bordered
        />
      </div>
    </div>
  );
};

ScoringConfigPage.displayName = 'ScoringConfigPage';

export default ScoringConfigPage;