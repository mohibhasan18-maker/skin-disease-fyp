'use client';

import React from 'react';

interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
  avatar?: string;
  senderName?: string;
  isLoading?: boolean;
}

export function ChatBubble({
  message,
  sender,
  timestamp,
  avatar,
  senderName,
  isLoading = false,
}: ChatBubbleProps) {
  const isUser = sender === 'user';

  return (
    <div
      className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
      role="article"
      aria-label={`Message from ${senderName || sender}`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={senderName || sender}
            className="w-10 h-10 rounded-full object-cover border-2 border-foreground/10 p-0.5 shadow-md"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
            isUser ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary/20 text-secondary border-secondary/30'
          }`}>
            {senderName ? senderName[0].toUpperCase() : isUser ? 'U' : 'D'}
          </div>
        )}
      </div>

      {/* Message Bubble container */}
      <div className={`flex flex-col gap-1.5 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {senderName && (
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1 mr-1">
            {senderName}
          </p>
        )}
        <div
          className={`px-5 py-3.5 rounded-2xl transition-all duration-300 shadow-sm ${
            isUser
              ? 'bg-primary text-on-primary rounded-tr-none shadow-primary/10'
              : 'bg-surface-highest text-foreground rounded-tl-none border border-foreground/5'
          } ${isLoading ? 'opacity-50 blur-[1px]' : ''}`}
        >
          {isLoading ? (
            <span className="flex gap-1.5 py-1">
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap font-body font-medium">{message}</p>
          )}
        </div>
        <p className="text-[10px] text-foreground/30 font-semibold px-1 italic">
          {timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
