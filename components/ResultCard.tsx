'use client';

import React from 'react';
import { Button } from './Button';

interface ResultCardProps {
  disease: string;
  confidence: number;
  description?: string;
  date: Date;
  severity?: 'low' | 'medium' | 'high';
  onViewDetails?: () => void;
  onDownload?: () => void;
}

export function ResultCard({
  disease,
  confidence,
  description,
  date,
  severity = 'medium',
  onViewDetails,
  onDownload,
}: ResultCardProps) {
  const severityStyles = {
    low: 'bg-green-50 border-green-200 text-green-900',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    high: 'bg-red-50 border-red-200 text-red-900',
  };

  const severityColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  return (
    <article className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(137,206,255,0.05)] border-l-4 overflow-hidden relative" style={{ borderLeftColor: severity === 'low' ? '#4ade80' : severity === 'medium' ? '#fbbf24' : '#f87171' }}>
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-xl ${severity === 'low' ? 'bg-green-500/10 text-green-400' : severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
          {severity === 'low' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold text-foreground leading-tight">{disease}</h3>
          <p className="text-xs text-foreground/40 mt-1 font-medium uppercase tracking-wider">
            Analysis Date: {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="mb-6 bg-foreground/5 p-4 rounded-xl border border-foreground/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">AI Confidence</span>
          <span className={`text-lg font-bold ${severity === 'low' ? 'text-green-400' : severity === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-surface-highest rounded-full h-2 overflow-hidden p-0.5 border border-foreground/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              severity === 'low'
                ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]'
                : severity === 'medium'
                ? 'bg-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]'
            }`}
            style={{ width: `${confidence * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-foreground/70 mb-8 leading-relaxed italic">
          "{description}"
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {onViewDetails && (
          <Button
            variant="secondary"
            size="md"
            onClick={onViewDetails}
            className="flex-1 border-foreground/10"
          >
            Insights
          </Button>
        )}
        {onDownload && (
          <Button
            variant="primary"
            size="md"
            onClick={onDownload}
            className="flex-1"
          >
            Report
          </Button>
        )}
      </div>
    </article>
  );
}
