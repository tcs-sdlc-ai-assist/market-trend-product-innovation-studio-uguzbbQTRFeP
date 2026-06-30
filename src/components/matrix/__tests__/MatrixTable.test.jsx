import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatrixTable from '../MatrixTable.jsx';

const validScores = {
  businessValue: 8,
  feasibility: 7,
  strategicAlignment: 9,
  customerFit: 8,
  sustainabilityFit: 6,
  evidenceConfidence: 7,
};

const scoredConcepts = [
  {
    id: 'c-1',
    name: 'Concept Alpha',
    description: 'First concept.',
    valueProposition: 'Delivers unique value.',
    targetUser: 'Health-conscious millennials',
    differentiation: 'First-to-market.',
    rationale: 'Strong strategic fit.',
    region: 'North America',
    segment: 'Beverages',
    scores: {
      businessValue: 9,
      feasibility: 8,
      strategicAlignment: 7,
      customerFit: 8,
      sustainabilityFit: 6,
      evidenceConfidence: 7,
    },
    weightedTotal: 7.7,
    rank: 1,
    confidenceLevel: 'high',
    confidenceNote: 'High confidence based on strong evidence.',
    scoringRationale: 'Strong overall performance across all criteria.',
    strengths: ['High business value'],
    weaknesses: [],
    assumptions: ['Assumption 1'],
    risks: ['Risk 1'],
    missingInfo: [],
  },
  {
    id: 'c-2',
    name: 'Concept Beta',
    description: 'Second concept.',
    valueProposition: 'Premium positioning.',
    targetUser: 'Gen Z consumers',
    differentiation: 'Blockchain traceability.',
    rationale: 'Sustainability leadership.',
    region: 'Europe',
    segment: 'Personal Care',
    scores: {
      businessValue: 6,
      feasibility: 5,
      strategicAlignment: 6,
      customerFit: 5,
      sustainabilityFit: 7,
      evidenceConfidence: 5,
    },
    weightedTotal: 5.7,
    rank: 2,
    confidenceLevel: 'medium',
    confidenceNote: 'Medium confidence.',
    scoringRationale: 'Moderate performance with room for improvement.',
    strengths: [],
    weaknesses: ['Below average feasibility'],
    assumptions: [],
    risks: [],
    missingInfo: ['Consumer research'],
  },
  {
    id: 'c-3',
    name: 'Concept Gamma',
    description: 'Third concept.',
    valueProposition: 'Cost-effective solution.',
    targetUser: 'Budget-conscious families',
    differentiation: 'Affordable premium.',
    rationale: 'Cost optimization.',
    region: 'Asia Pacific',
    segment: 'Snacks',
    scores: {
      businessValue: 4,
      feasibility: 3,
      strategicAlignment: 5,
      customerFit: 4,
      sustainabilityFit: 3,
      evidenceConfidence: 4,
    },
    weightedTotal: 3.9,
    rank: 3,
    confidenceLevel: 'low',
    confidenceNote: 'Low confidence due to limited data.',
    scoringRationale: 'Significant challenges identified.',
    strengths: [],
    weaknesses: ['Critical gap in feasibility'],
    assumptions: [],
    risks: ['Supply chain risk'],
    missingInfo: ['Feasibility study'],
  },
];

describe('MatrixTable', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ===========================================================================
  // Rendering
  // ===========================================================================

  describe('rendering', () => {
    it('renders the matrix table with scored concepts', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Feasibility & Value Matrix')).toBeInTheDocument();
      expect(screen.getByText('Concept Alpha')).toBeInTheDocument();
      expect(screen.getByText('Concept Beta')).toBeInTheDocument();
      expect(screen.getByText('Concept Gamma')).toBeInTheDocument();
    });

    it('renders the correct number of concept rows', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr');
      expect(rows.length).toBe(3);
    });

    it('renders the concepts count in the header', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText(/concepts scored and ranked/)).toBeInTheDocument();
    });

    it('renders the table element with proper role', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <MatrixTable scoredConcepts={scoredConcepts} className="custom-class" />,
      );

      const wrapper = container.firstChild;
      expect(wrapper.className).toContain('custom-class');
    });

    it('renders with custom ariaLabel', () => {
      render(
        <MatrixTable
          scoredConcepts={scoredConcepts}
          ariaLabel="Custom matrix label"
        />,
      );

      expect(screen.getByLabelText('Custom matrix label')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Column Headers
  // ===========================================================================

  describe('column headers', () => {
    it('renders the Rank column header when showRank is true', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showRank />);

      expect(screen.getByText('Rank')).toBeInTheDocument();
    });

    it('does not render the Rank column header when showRank is false', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showRank={false} />);

      expect(screen.queryByText('Rank')).not.toBeInTheDocument();
    });

    it('renders the Concept column header', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Concept')).toBeInTheDocument();
    });

    it('renders scoring criteria column headers', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Business Value')).toBeInTheDocument();
      expect(screen.getByText('Feasibility')).toBeInTheDocument();
      expect(screen.getByText('Strategic Alignment')).toBeInTheDocument();
      expect(screen.getByText('Customer Fit')).toBeInTheDocument();
      expect(screen.getByText('Sustainability Fit')).toBeInTheDocument();
      expect(screen.getByText('Evidence Confidence')).toBeInTheDocument();
    });

    it('renders the Total column header', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('renders the Confidence column header when showConfidence is true', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showConfidence />);

      expect(screen.getByText('Confidence')).toBeInTheDocument();
    });

    it('does not render the Confidence column header when showConfidence is false', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showConfidence={false} />);

      const headers = screen.getAllByRole('columnheader');
      const confidenceHeader = headers.find((h) => h.textContent.includes('Confidence'));
      expect(confidenceHeader).toBeUndefined();
    });

    it('all column headers have scope="col"', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showRank showConfidence />);

      const headers = screen.getAllByRole('columnheader');
      for (const header of headers) {
        expect(header).toHaveAttribute('scope', 'col');
      }
    });
  });

  // ===========================================================================
  // Score Display
  // ===========================================================================

  describe('score display', () => {
    it('displays individual criterion scores for each concept', () => {
      render(<MatrixTable scoredConcepts={[scoredConcepts[0]]} showRank={false} showConfidence={false} />);

      const cells = screen.getAllByRole('cell');
      const scoreTexts = cells.map((c) => c.textContent);

      expect(scoreTexts.some((t) => t.includes('9'))).toBe(true);
      expect(scoreTexts.some((t) => t.includes('8'))).toBe(true);
      expect(scoreTexts.some((t) => t.includes('7'))).toBe(true);
      expect(scoreTexts.some((t) => t.includes('6'))).toBe(true);
    });

    it('displays weighted total score for each concept', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('7.7')).toBeInTheDocument();
      expect(screen.getByText('5.7')).toBeInTheDocument();
      expect(screen.getByText('3.9')).toBeInTheDocument();
    });

    it('displays rank badges when showRank is true', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showRank />);

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
    });

    it('displays concept names in the table', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Concept Alpha')).toBeInTheDocument();
      expect(screen.getByText('Concept Beta')).toBeInTheDocument();
      expect(screen.getByText('Concept Gamma')).toBeInTheDocument();
    });

    it('displays segment and region metadata for concepts', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Beverages')).toBeInTheDocument();
      expect(screen.getByText('North America')).toBeInTheDocument();
      expect(screen.getByText('Personal Care')).toBeInTheDocument();
      expect(screen.getByText('Europe')).toBeInTheDocument();
    });

    it('displays confidence badges when showConfidence is true', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showConfidence />);

      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('displays dash for missing scores', () => {
      const conceptWithMissingScores = [
        {
          id: 'c-missing',
          name: 'Missing Scores Concept',
          scores: {},
          weightedTotal: 0,
          rank: 1,
        },
      ];

      render(<MatrixTable scoredConcepts={conceptWithMissingScores} showRank={false} showConfidence={false} />);

      const cells = screen.getAllByRole('cell');
      const dashCells = cells.filter((c) => c.textContent.includes('—'));
      expect(dashCells.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Score Legend
  // ===========================================================================

  describe('score legend', () => {
    it('renders the score legend', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Score Legend:')).toBeInTheDocument();
      expect(screen.getByText('8–10 Strong')).toBeInTheDocument();
      expect(screen.getByText('6–7 Good')).toBeInTheDocument();
      expect(screen.getByText('5 Adequate')).toBeInTheDocument();
      expect(screen.getByText('3–4 Below Avg')).toBeInTheDocument();
      expect(screen.getByText('1–2 Critical')).toBeInTheDocument();
    });

    it('renders hover instruction text', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByText('Hover over scores for rationale')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Sorting Behavior
  // ===========================================================================

  describe('sorting behavior', () => {
    it('sorts by weighted total descending by default', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr');

      const firstRowText = rows[0].textContent;
      const lastRowText = rows[2].textContent;

      expect(firstRowText).toContain('Concept Alpha');
      expect(lastRowText).toContain('Concept Gamma');
    });

    it('toggles sort direction when clicking the same column header', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const totalButton = screen.getByRole('button', { name: /sort by total/i });
      await user.click(totalButton);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr');

      const firstRowText = rows[0].textContent;
      expect(firstRowText).toContain('Concept Gamma');
    });

    it('sorts by concept name when clicking the Concept column header', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const conceptButton = screen.getByRole('button', { name: /sort by concept/i });
      await user.click(conceptButton);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr');

      const firstRowText = rows[0].textContent;
      expect(firstRowText).toContain('Concept Alpha');
    });

    it('sorts by name descending on second click of Concept header', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const conceptButton = screen.getByRole('button', { name: /sort by concept/i });
      await user.click(conceptButton);
      await user.click(conceptButton);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr');

      const firstRowText = rows[0].textContent;
      expect(firstRowText).toContain('Concept Gamma');
    });

    it('sorts by rank when clicking the Rank column header', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} showRank />);

      const rankButton = screen.getByRole('button', { name: /sort by rank/i });
      await user.click(rankButton);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr');

      const firstRowText = rows[0].textContent;
      expect(firstRowText).toContain('Concept Alpha');
    });

    it('sorts by a scoring criterion when clicking its column header', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const bvButton = screen.getByRole('button', { name: /sort by business value/i });
      await user.click(bvButton);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr');

      const firstRowText = rows[0].textContent;
      expect(firstRowText).toContain('Concept Alpha');
    });

    it('updates aria-sort attribute on sorted column', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const totalHeader = screen.getAllByRole('columnheader').find((h) =>
        h.textContent.includes('Total'),
      );
      expect(totalHeader).toHaveAttribute('aria-sort', 'descending');

      const totalButton = screen.getByRole('button', { name: /sort by total/i });
      await user.click(totalButton);

      expect(totalHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  // ===========================================================================
  // Tooltip Rationale
  // ===========================================================================

  describe('tooltip rationale', () => {
    it('renders score cells with tooltip wrappers', () => {
      render(<MatrixTable scoredConcepts={[scoredConcepts[0]]} showRank={false} showConfidence={false} />);

      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('score cells have aria-label with score information', () => {
      render(<MatrixTable scoredConcepts={[scoredConcepts[0]]} showRank={false} showConfidence={false} />);

      const businessValueLabel = screen.getByLabelText(/Business Value: 9 out of 10/i);
      expect(businessValueLabel).toBeInTheDocument();
    });

    it('weighted total has aria-label with score information', () => {
      render(<MatrixTable scoredConcepts={[scoredConcepts[0]]} showRank={false} showConfidence={false} />);

      const totalLabel = screen.getByLabelText(/Weighted total: 7.7 out of 10/i);
      expect(totalLabel).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe('accessibility', () => {
    it('renders the table with aria-label', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label', 'Feasibility and value matrix');
    });

    it('renders the region wrapper with aria-label', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByRole('region', { name: 'Feasibility and value matrix' })).toBeInTheDocument();
    });

    it('all column headers have scope attribute', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showRank showConfidence />);

      const headers = screen.getAllByRole('columnheader');
      for (const header of headers) {
        expect(header).toHaveAttribute('scope', 'col');
      }
    });

    it('table cells have role="cell"', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('sortable headers have sort buttons with aria-label', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      expect(screen.getByRole('button', { name: /sort by concept/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sort by total/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sort by business value/i })).toBeInTheDocument();
    });

    it('active sort column has aria-sort attribute', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const totalHeader = screen.getAllByRole('columnheader').find((h) =>
        h.textContent.includes('Total'),
      );
      expect(totalHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('non-active sort columns have aria-sort="none"', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const conceptHeader = screen.getAllByRole('columnheader').find((h) =>
        h.textContent.includes('Concept'),
      );
      expect(conceptHeader).toHaveAttribute('aria-sort', 'none');
    });
  });

  // ===========================================================================
  // Row Click Interaction
  // ===========================================================================

  describe('row click interaction', () => {
    it('calls onConceptClick when a row is clicked', async () => {
      const user = userEvent.setup();
      const onConceptClick = vi.fn();

      render(
        <MatrixTable
          scoredConcepts={scoredConcepts}
          onConceptClick={onConceptClick}
        />,
      );

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      await user.click(firstRow);

      expect(onConceptClick).toHaveBeenCalledTimes(1);
      expect(onConceptClick).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Concept Alpha' }),
      );
    });

    it('does not call onConceptClick when not provided', async () => {
      const user = userEvent.setup();

      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      await user.click(firstRow);
      // No error should occur
    });

    it('rows are focusable when onConceptClick is provided', () => {
      const onConceptClick = vi.fn();

      render(
        <MatrixTable
          scoredConcepts={scoredConcepts}
          onConceptClick={onConceptClick}
        />,
      );

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      expect(firstRow).toHaveAttribute('tabindex', '0');
    });

    it('rows are not focusable when onConceptClick is not provided', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      expect(firstRow).not.toHaveAttribute('tabindex');
    });

    it('rows have role="button" when onConceptClick is provided', () => {
      const onConceptClick = vi.fn();

      render(
        <MatrixTable
          scoredConcepts={scoredConcepts}
          onConceptClick={onConceptClick}
        />,
      );

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      expect(firstRow).toHaveAttribute('role', 'button');
    });

    it('rows have role="row" when onConceptClick is not provided', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      expect(firstRow).toHaveAttribute('role', 'row');
    });

    it('calls onConceptClick on Enter key press', async () => {
      const user = userEvent.setup();
      const onConceptClick = vi.fn();

      render(
        <MatrixTable
          scoredConcepts={scoredConcepts}
          onConceptClick={onConceptClick}
        />,
      );

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      firstRow.focus();
      await user.keyboard('{Enter}');

      expect(onConceptClick).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // Empty State
  // ===========================================================================

  describe('empty state', () => {
    it('renders empty state when no scored concepts are provided', () => {
      render(<MatrixTable scoredConcepts={[]} />);

      expect(screen.getByText('No Scored Concepts')).toBeInTheDocument();
    });

    it('renders empty state with default empty array', () => {
      render(<MatrixTable />);

      expect(screen.getByText('No Scored Concepts')).toBeInTheDocument();
    });

    it('renders empty state message text', () => {
      render(<MatrixTable scoredConcepts={[]} />);

      expect(
        screen.getByText(/Score your concepts to view the feasibility and value matrix/i),
      ).toBeInTheDocument();
    });

    it('renders generate scores button in empty state when onRegenerate is provided', () => {
      const onRegenerate = vi.fn();

      render(<MatrixTable scoredConcepts={[]} onRegenerate={onRegenerate} />);

      expect(screen.getByText('Generate Scores')).toBeInTheDocument();
    });

    it('does not render generate scores button when readOnly is true', () => {
      const onRegenerate = vi.fn();

      render(<MatrixTable scoredConcepts={[]} onRegenerate={onRegenerate} readOnly />);

      expect(screen.queryByText('Generate Scores')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Loading State
  // ===========================================================================

  describe('loading state', () => {
    it('renders loading spinner when isLoading is true', () => {
      render(<MatrixTable scoredConcepts={[]} isLoading />);

      expect(screen.getByText('Generating feasibility matrix...')).toBeInTheDocument();
    });

    it('does not render table when isLoading is true', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} isLoading />);

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders loading region with proper aria-label', () => {
      render(<MatrixTable scoredConcepts={[]} isLoading />);

      expect(
        screen.getByRole('region', { name: 'Generating scoring matrix' }),
      ).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Rank #1 Highlighting
  // ===========================================================================

  describe('rank #1 highlighting', () => {
    it('applies highlight styling to the top-ranked concept row', () => {
      render(<MatrixTable scoredConcepts={scoredConcepts} showRank />);

      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      const firstRow = tbody.querySelector('tr');

      expect(firstRow.className).toContain('bg-green-50/30');
    });
  });

  // ===========================================================================
  // Concepts with missing data
  // ===========================================================================

  describe('concepts with missing data', () => {
    it('handles concept with missing name gracefully', () => {
      const conceptsWithMissingName = [
        {
          id: 'c-no-name',
          scores: validScores,
          weightedTotal: 7.0,
          rank: 1,
        },
      ];

      render(<MatrixTable scoredConcepts={conceptsWithMissingName} />);

      expect(screen.getByText('Unnamed Concept')).toBeInTheDocument();
    });

    it('handles concept with missing scores gracefully', () => {
      const conceptsWithNoScores = [
        {
          id: 'c-no-scores',
          name: 'No Scores',
          weightedTotal: 0,
          rank: 1,
        },
      ];

      render(<MatrixTable scoredConcepts={conceptsWithNoScores} />);

      expect(screen.getByText('No Scores')).toBeInTheDocument();
    });

    it('handles concept with missing rank gracefully', () => {
      const conceptsWithNoRank = [
        {
          id: 'c-no-rank',
          name: 'No Rank Concept',
          scores: validScores,
          weightedTotal: 7.0,
        },
      ];

      render(<MatrixTable scoredConcepts={conceptsWithNoRank} showRank />);

      expect(screen.getByText('No Rank Concept')).toBeInTheDocument();
    });

    it('handles concept with missing confidence level gracefully', () => {
      const conceptsWithNoConfidence = [
        {
          id: 'c-no-conf',
          name: 'No Confidence Concept',
          scores: validScores,
          weightedTotal: 7.0,
          rank: 1,
        },
      ];

      render(<MatrixTable scoredConcepts={conceptsWithNoConfidence} showConfidence />);

      expect(screen.getByText('No Confidence Concept')).toBeInTheDocument();
      const cells = screen.getAllByRole('cell');
      const dashCells = cells.filter((c) => c.textContent === '—');
      expect(dashCells.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Single concept
  // ===========================================================================

  describe('single concept', () => {
    it('renders correctly with a single scored concept', () => {
      render(<MatrixTable scoredConcepts={[scoredConcepts[0]]} />);

      expect(screen.getByText('Concept Alpha')).toBeInTheDocument();
      expect(screen.getByText('7.7')).toBeInTheDocument();
      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/concept scored and ranked/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Keyboard navigation for sort headers
  // ===========================================================================

  describe('keyboard navigation for sort headers', () => {
    it('activates sort on Enter key press on column header button', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const conceptButton = screen.getByRole('button', { name: /sort by concept/i });
      conceptButton.focus();
      await user.keyboard('{Enter}');

      const conceptHeader = screen.getAllByRole('columnheader').find((h) =>
        h.textContent.includes('Concept'),
      );
      expect(conceptHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('activates sort on Space key press on column header button', async () => {
      const user = userEvent.setup();
      render(<MatrixTable scoredConcepts={scoredConcepts} />);

      const conceptButton = screen.getByRole('button', { name: /sort by concept/i });
      conceptButton.focus();
      await user.keyboard(' ');

      const conceptHeader = screen.getAllByRole('columnheader').find((h) =>
        h.textContent.includes('Concept'),
      );
      expect(conceptHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });
});