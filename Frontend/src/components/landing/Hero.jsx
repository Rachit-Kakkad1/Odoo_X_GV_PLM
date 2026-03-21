import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight, Play, CheckCircle } from 'lucide-react'
import HeroCanvas from './HeroCanvas'
import TealButton from './ui/TealButton'

export default function Hero() {
  const headlineRef = useRef()
  const subRef = useRef()
  const ctaRef = useRef()
  const mockupRef = useRef()
  const badgeRef = useRef()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Just make everything visible
      gsap.set([badgeRef.current, headlineRef.current.querySelectorAll('.word'), subRef.current, ctaRef.current.children, mockupRef.current], { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, rotateX: 8 })
      return
    }

    const tl = gsap.timeline({ delay: 0.2 })

    // Badge slides down
    tl.fromTo(badgeRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )

    // Split headline words and animate each
    const words = headlineRef.current.querySelectorAll('.word')
    tl.fromTo(words,
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.8, ease: 'power3.out',
        stagger: 0.06
      }, '-=0.2'
    )

    // Subheadline
    tl.fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )

    // CTA buttons
    tl.fromTo(ctaRef.current.children,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1, scale: 1,
        duration: 0.5, ease: 'back.out(1.7)',
        stagger: 0.1
      }, '-=0.3'
    )

    // Mockup rises up
    tl.fromTo(mockupRef.current,
      { opacity: 0, y: 80, rotateX: 20 },
      { opacity: 1, y: 0, rotateX: 8, duration: 1, ease: 'power3.out' },
      '-=0.5'
    )
  }, [])

  // Wrap headline text in word spans
  const headline1 = "Engineering Changes,"
  const headline2 = "Executed with Control."

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Three.js Background */}
      <HeroCanvas />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(13,148,136,0.08) 0%, transparent 70%)'
        }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20 w-full overflow-hidden">

        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 mb-8 opacity-0 max-w-full">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs sm:text-sm font-semibold text-[#312E24] cursor-pointer group hover:bg-white/40 transition-colors">
            <span className="text-[#312E24] drop-shadow-[0_0_8px_rgba(49,46,36,0.3)]">✦</span>
            Introducing PLM Flow v1.0
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Headline */}
        <h1 ref={headlineRef} className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.2] md:leading-[1.1] mb-6 tracking-tight flex flex-col items-center w-full">
          <div className="mb-2 flex flex-wrap justify-center gap-x-2 md:gap-x-3 lg:gap-x-4 w-full">
            {headline1.split(' ').map((word, i) => (
              <span key={i} className="word inline-block text-slate-900 opacity-0">
                {word}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-2 md:gap-x-3 lg:gap-x-4 w-full">
            {headline2.split(' ').map((word, i) => (
              <span key={i} className="word inline-block text-gradient opacity-0 pb-1">
                {word}
              </span>
            ))}
          </div>
        </h1>

        {/* Subheadline */}
        <p ref={subRef}
          className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 px-2">
          The only PLM system that makes uncontrolled changes
          technically impossible. Every modification versioned,
          approved, and traceable — by design.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-10 px-4">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <TealButton size="lg" glow className="w-full">
              Start Free Trial <ArrowRight size={18} />
            </TealButton>
          </Link>
          <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full glass
            text-[#312E24] font-semibold text-lg transition-all duration-200
            hover:border-[#312E24]/50 hover:bg-[#312E24]/5 active:scale-95 group w-full sm:w-auto">
            <Play size={18} className="text-[#312E24] group-hover:scale-110 transition-transform" />
            Watch Demo
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-500 mb-16 px-4">
          {['No credit card required', 'Free 14-day trial', 'SOC 2 Compliant'].map(t => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle size={16} className="text-teal-500 flex-shrink-0" />
              {t}
            </span>
          ))}
        </div>

        {/* Product Mockup */}
        <div ref={mockupRef}
          className="relative opacity-0 mx-auto max-w-4xl w-full px-2 sm:px-0"
          style={{
            perspective: '1200px',
            transform: window.innerWidth < 640 ? 'none' : 'rotateX(8deg)',
          }}>
          <div className="glass rounded-2xl p-3 sm:p-4 md:p-6 overflow-hidden bg-white/40 border border-white/40 shadow-2xl"
            style={{
              boxShadow: '0 30px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.3)',
            }}>
            {/* Window controls mockup */}
            <div className="flex gap-1.5 mb-3 sm:mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400/30" />
            </div>
            
            {/* Mock Kanban board */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-hidden md:justify-between mask-edges no-scrollbar pb-1">
              {[
                { stage: 'New', color: '#64748B', ecos: ['ECO-083: Chassis rev2', 'ECO-084: Vendor sync'], visibility: 'block' },
                { stage: 'In Review', color: '#3B82F6', ecos: ['ECO-082: Cost update'], visibility: 'block' },
                { stage: 'Approval', color: '#F59E0B', ecos: ['ECO-080: Screw 12→16', 'ECO-081: Assembly'], visibility: 'hidden sm:block' },
                { stage: 'Done', color: '#10B981', ecos: ['ECO-078: v2 applied', 'ECO-079: Optimize'], visibility: 'hidden lg:block' },
              ].map(col => (
                <div key={col.stage} className={`flex-1 min-w-[200px] xs:min-w-[180px] sm:min-w-[0] ${col.visibility}`}>
                  <div className="flex items-center gap-2 mb-2 px-1 border-b border-black/5 pb-1.5">
                    <div className="w-2 h-2 rounded-full shadow-sm" style={{ background: col.color }} />
                    <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-800 uppercase">{col.stage}</span>
                    <span className="ml-auto text-[10px] font-bold bg-black/5 px-1.5 py-0.5 rounded text-slate-600">{col.ecos.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.ecos.map(eco => (
                      <div key={eco}
                        className="p-2.5 sm:p-3 rounded-xl text-[10px] sm:text-xs font-medium bg-white/60 border border-white/80 shadow-sm
                          hover:border-teal-500/30 hover:bg-white transition-all cursor-default relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-100 transition-opacity" style={{ background: col.color }} />
                        <span className="block text-slate-900 mb-0.5 font-mono font-bold">{eco.split(':')[0]}</span>
                        <span className="block text-slate-600 truncate">{eco.split(':')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-slate-600 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
