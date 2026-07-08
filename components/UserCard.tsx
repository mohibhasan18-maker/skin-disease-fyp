'use client';

import React from 'react';
import { Button } from './Button';

interface UserCardProps {
  name: string;
  role: 'patient' | 'doctor';
  avatar?: string;
  specialty?: string;
  experience?: number;
  rating?: number;
  availability?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function UserCard({
  name,
  role,
  avatar,
  specialty,
  experience,
  rating,
  availability,
  description,
  onAction,
  actionLabel = role === 'doctor' ? 'Book Consultation' : 'View Profile',
}: UserCardProps) {
  return (
    <article className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(137,206,255,0.1)] hover:-translate-y-1">
      {/* Avatar and Header */}
      <div className="flex gap-4 mb-4">
        {avatar ? (
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 p-0.5"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-surface rounded-full" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-lg border-2 border-secondary/20">
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-lg font-heading font-bold text-foreground leading-tight">{name}</h3>
          {specialty && (
            <p className="text-sm font-medium text-secondary/80 mt-0.5">{specialty}</p>
          )}
          {role === 'doctor' && experience && (
            <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider font-semibold">
              {experience} Years Clinical Exp.
            </p>
          )}
        </div>
      </div>

      {/* Rating */}
      {rating !== undefined && (
        <div className="flex items-center gap-2 mb-4 bg-on-background/5 w-fit px-2 py-1 rounded-lg">
          <div className="flex gap-0.5" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(rating)
                    ? 'text-accent fill-current'
                    : 'text-foreground/20 fill-current'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold text-foreground/90">
            {rating.toFixed(1)}
          </span>
        </div>
      )}

      {/* Availability */}
      {availability && (
        <div className="flex items-center gap-2 mb-4 text-xs text-foreground/60">
          <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{availability}</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-foreground/70 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Action Button */}
      {onAction && (
        <Button
          variant="secondary"
          size="md"
          onClick={onAction}
          className="w-full !rounded-lg border-secondary/30"
        >
          {actionLabel}
        </Button>
      )}
    </article>
  );
}
