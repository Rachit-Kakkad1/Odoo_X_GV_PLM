import { useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tag, Eye, GitCompare, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, timeAgo } from '../../utils/dateUtils';

/**
 * VersionHistory — Horizontal scrollable timeline of product version evolution.
 */
export default function VersionHistory({ product, onViewDiff }) {
  const scrollRef = useRef(null);
  const [hoveredVer, setHoveredVer] = useState(null);
  const versions = useMemo(() => {
    if (!product?.versions) return [];
    return [...product.versions].sort((a, b) => {
      const va = a.version.split('.').map(Number);
      const vb = b.version.split('.').map(Number);
      for (let i = 0; i < Math.max(va.length, vb.length); i++) {
        if ((va[i] || 0) !== (vb[i] || 0)) return (va[i] || 0) - (vb[i] || 0);
      }
      return 0;
    });
  }, [product]);

  const scroll = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  }, []);

  if (!versions.length) {
    return (
      <div style={{
        padding: 48, textAlign: 'center', fontFamily: 'Inter, system-ui, sans-serif',
        background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
      }}>
        <Tag size={36} style={{ color: '#CBD5E1', margin: '0 auto 12px' }} />
        <p style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>No version history yet</p>
        <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          This is version {product?.version || '1'}. History will build as ECOs are applied.
        </p>
      </div>
    );
  }

  const currentVersion = versions[versions.length - 1];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag size={15} style={{ color: '#64748B' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Version History
          </h3>
          <span style={{
            padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
            background: '#CCFBF1', color: '#0D9488',
          }}>
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => scroll(-1)} style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 150ms ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            <ChevronLeft size={14} style={{ color: '#64748B' }} />
          </button>
          <button onClick={() => scroll(1)} style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 150ms ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            <ChevronRight size={14} style={{ color: '#64748B' }} />
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 12,
          scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent',
        }}
      >
        {versions.map((ver, idx) => {
          const isCurrent = idx === versions.length - 1;
          const isHovered = hoveredVer === ver.version;

          return (
            <div key={ver.version} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {/* Version Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                onMouseEnter={() => setHoveredVer(ver.version)}
                onMouseLeave={() => setHoveredVer(null)}
                style={{
                  width: 200, padding: 16, borderRadius: 8, position: 'relative',
                  background: '#fff',
                  border: isCurrent ? '2px solid #0D9488' : '1.5px solid #E2E8F0',
                  boxShadow: isHovered
                    ? '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)'
                    : '0 1px 3px rgba(0,0,0,0.06)',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 200ms ease', cursor: 'default',
                }}
              >
                {/* Badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10,
                  background: isCurrent ? '#CCFBF1' : '#F1F5F9',
                  color: isCurrent ? '#0D9488' : '#94A3B8',
                }}>
                  {isCurrent ? 'Current' : 'Archived'}
                </span>

                {/* Version Number */}
                <p style={{
                  fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '4px 0',
                  color: isCurrent ? '#0F172A' : '#94A3B8',
                }}>
                  v{ver.version}
                </p>

                {/* Date */}
                <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0' }}>
                  {formatDate(ver.date)}
                </p>

                {/* Changed by */}
                {ver.changedBy && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <User size={10} style={{ color: '#CBD5E1' }} />
                    <span style={{ fontSize: 11, color: '#64748B' }}>{ver.changedBy}</span>
                  </div>
                )}

                {/* ECO Reference */}
                {ver.eco && (
                  <div style={{ marginTop: 6 }}>
                    <span style={{
                      fontSize: 11, fontFamily: 'monospace', color: '#0D9488', fontWeight: 600,
                    }}>
                      via {ver.eco}
                    </span>
                  </div>
                )}

                {/* Active dot */}
                {isCurrent && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginTop: 10,
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', background: '#10B981',
                      animation: 'pulse 2s ease-in-out infinite',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#10B981' }}>Active</span>
                  </div>
                )}

                {/* Summary */}
                {ver.summary && (
                  <p style={{
                    fontSize: 11, color: '#64748B', lineHeight: 1.5, marginTop: 8,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {ver.summary}
                  </p>
                )}

                {/* Tooltip on hover */}
                {isHovered && ver.summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                      marginBottom: 8, padding: '10px 14px', borderRadius: 8, background: '#0C1A2E',
                      color: '#fff', fontSize: 11, lineHeight: 1.5, width: 220, zIndex: 50,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                      pointerEvents: 'none',
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{ver.summary}</p>
                    {ver.changedBy && <p style={{ color: '#94A3B8' }}>By: {ver.changedBy}</p>}
                    {ver.date && <p style={{ color: '#94A3B8' }}>{formatDate(ver.date)}</p>}
                    <div style={{
                      position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                      width: 8, height: 8, background: '#0C1A2E', borderRadius: 1,
                      transform: 'translateX(-50%) rotate(45deg)',
                    }} />
                  </motion.div>
                )}
              </motion.div>

              {/* Arrow connector between versions */}
              {idx < versions.length - 1 && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '0 8px', flexShrink: 0, minWidth: 80,
                }}>
                  {versions[idx + 1].eco && (
                    <span style={{
                      fontSize: 9, fontFamily: 'monospace', color: '#0D9488', fontWeight: 600,
                      marginBottom: 2, whiteSpace: 'nowrap',
                    }}>
                      {versions[idx + 1].eco}
                    </span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{ width: 32, height: 1.5, background: '#CBD5E1' }} />
                    <ArrowRight size={12} style={{ color: '#CBD5E1', margin: '-0.5px 0 0 -2px' }} />
                  </div>

                  {/* Compare button */}
                  {onViewDiff && (
                    <button
                      onClick={() => onViewDiff(ver.version, versions[idx + 1].version)}
                      style={{
                        marginTop: 4, padding: '3px 8px', borderRadius: 4, fontSize: 9,
                        fontWeight: 600, background: '#F8FAFC', color: '#64748B',
                        border: '1px solid #E2E8F0', cursor: 'pointer',
                        transition: 'all 150ms ease', whiteSpace: 'nowrap',
                        display: 'flex', alignItems: 'center', gap: 3,
                        fontFamily: 'Inter, system-ui, sans-serif',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#CCFBF1'; e.currentTarget.style.color = '#0D9488'; e.currentTarget.style.borderColor = '#0D9488'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                    >
                      <GitCompare size={9} />
                      Compare
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 2px rgba(16,185,129,0.2); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }
        }
      `}</style>
    </div>
  );
}
