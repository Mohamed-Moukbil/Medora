import katex from 'katex'

interface Equation {
  tex: string
  x: string
  y: string
  size: string
  color: string
}

const equations: Equation[] = [
  { tex: 'e^{i\\pi} + 1 = 0', x: '12%', y: '8%', size: 'text-lg', color: '--muted-foreground' },
  { tex: 'E = mc^2', x: '80%', y: '5%', size: 'text-2xl', color: '--primary' },
  { tex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}', x: '5%', y: '48%', size: 'text-base', color: '260 40% 50%' },
  { tex: '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}', x: '82%', y: '44%', size: 'text-lg', color: '--primary' },
  { tex: 'i\\hbar\\frac{\\partial}{\\partial t}|\\psi\\rangle = \\hat{H}|\\psi\\rangle', x: '8%', y: '80%', size: 'text-base', color: '260 40% 50%' },
  { tex: '\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}', x: '85%', y: '78%', size: 'text-lg', color: '--primary' },
  { tex: 'a^2 + b^2 = c^2', x: '45%', y: '88%', size: 'text-xl', color: '260 40% 50%' },
  { tex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', x: '50%', y: '10%', size: 'text-base', color: '--primary' },
]

function render(tex: string): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode: true })
  } catch {
    return ''
  }
}

const floatCSS = `
  @keyframes eq-a {
    0%   { transform: translate(0, 0) rotate(0deg); }
    20%  { transform: translate(18px, -22px) rotate(1.5deg); }
    40%  { transform: translate(-12px, -35px) rotate(-1deg); }
    60%  { transform: translate(8px, -18px) rotate(0.8deg); }
    80%  { transform: translate(-15px, -8px) rotate(-0.5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes eq-b {
    0%   { transform: translate(0, 0) rotate(0deg); }
    20%  { transform: translate(-20px, -15px) rotate(-1.2deg); }
    40%  { transform: translate(15px, -28px) rotate(1.8deg); }
    60%  { transform: translate(-8px, -40px) rotate(-0.6deg); }
    80%  { transform: translate(12px, -20px) rotate(0.3deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes eq-c {
    0%   { transform: translate(0, 0) rotate(0deg); }
    25%  { transform: translate(10px, -30px) rotate(1deg); }
    50%  { transform: translate(-18px, -20px) rotate(-1.5deg); }
    75%  { transform: translate(5px, -12px) rotate(0.5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes eq-d {
    0%   { transform: translate(0, 0) rotate(0deg) scale(1); }
    30%  { transform: translate(-14px, -25px) rotate(-1deg) scale(1.02); }
    60%  { transform: translate(20px, -15px) rotate(1.2deg) scale(0.98); }
    100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  }
  .eq-0 { animation: eq-a 18s ease-in-out infinite; }
  .eq-1 { animation: eq-b 22s ease-in-out infinite 1.5s; }
  .eq-2 { animation: eq-c 16s ease-in-out infinite 3s; }
  .eq-3 { animation: eq-d 20s ease-in-out infinite 0.8s; }
  .eq-4 { animation: eq-b 19s ease-in-out infinite 4s; }
  .eq-5 { animation: eq-a 21s ease-in-out infinite 2s; }
  .eq-6 { animation: eq-d 17s ease-in-out infinite 5s; }
  .eq-7 { animation: eq-c 23s ease-in-out infinite 2.5s; }
  .hero-eq .katex { color: inherit; }
`

export function HeroEquations() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatCSS }} />
      {equations.map((eq, i) => (
        <div
          key={i}
          className={`hero-eq absolute pointer-events-none select-none eq-${i} ${eq.size}`}
          style={{
            left: eq.x,
            top: eq.y,
            opacity: 0.1,
            color: `hsl(var(${eq.color}))`,
          }}
          dangerouslySetInnerHTML={{ __html: render(eq.tex) }}
        />
      ))}
    </>
  )
}
