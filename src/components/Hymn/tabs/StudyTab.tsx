/**
 * Study Tab - Learning tools and resources
 */

import type { RigvedaHymn } from '../../../types/rigveda';
import { COLORS } from '../../../styles/colors';
import { generateStudyPlan } from '../../../lib/hymnAdapter';

interface StudyTabProps {
  hymn: RigvedaHymn;
}

export function StudyTab({ hymn }: StudyTabProps) {
  const studyPlan = generateStudyPlan(hymn);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accent.goldLight }}>
          Study Guide
        </h2>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          Structured learning path and practical tools for deep understanding
        </p>
      </div>

      {/* Study Plan */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
          <span>📋</span> Recommended Study Plan
        </h3>
        <div className="space-y-2">
          {studyPlan.map((step, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg"
              style={{ backgroundColor: COLORS.background.elevated }}
            >
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: `${COLORS.accent.gold}30`,
                  color: COLORS.accent.gold,
                }}
              >
                {index + 1}
              </div>
              <div className="flex-1 text-sm" style={{ color: COLORS.text.primary }}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Terms Glossary */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
          <span>📖</span> Key Terms ({hymn.keyTerms.length})
        </h3>
        <div className="space-y-2">
          {hymn.keyTerms.map((term, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: COLORS.background.elevated,
                borderColor: COLORS.border.subtle,
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-base font-serif font-semibold" style={{ color: COLORS.accent.gold }}>
                  {term.sanskrit}
                </span>
                <span className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                  ({term.term})
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                {term.definition}
              </p>
              {term.firstAppearance && (
                <div className="text-xs" style={{ color: COLORS.text.tertiary }}>
                  First appears in: {term.firstAppearance}
                </div>
              )}
              {term.relatedTerms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {term.relatedTerms.map((related, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: `${COLORS.accent.cyan}20`,
                        color: COLORS.accent.cyan,
                      }}
                    >
                      {related}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Questions */}
      {hymn.discussionQuestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>❓</span> Discussion Questions
          </h3>
          <div className="space-y-3">
            {hymn.discussionQuestions.map((question, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: `${COLORS.accent.purple}10`,
                  borderColor: COLORS.border.subtle,
                }}
              >
                <div className="flex gap-3">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: COLORS.accent.purple,
                      color: COLORS.background.primary,
                    }}
                  >
                    {index + 1}
                  </div>
                  <p className="flex-1 text-sm" style={{ color: COLORS.text.primary }}>
                    {question}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical Applications */}
      {hymn.practicalApplications.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.accent.goldLight }}>
            <span>🎯</span> Practical Applications
          </h3>
          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
            Ways to integrate this hymn's wisdom into daily life:
          </p>
          <div className="space-y-2">
            {hymn.practicalApplications.map((application, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 rounded-lg border"
                style={{
                  backgroundColor: COLORS.background.elevated,
                  borderColor: COLORS.border.subtle,
                }}
              >
                <div style={{ color: COLORS.accent.cyan }}>•</div>
                <div className="flex-1 text-sm" style={{ color: COLORS.text.primary }}>
                  {application}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
