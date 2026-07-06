import { PrismaClient, SubjectCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@medora.dev' },
    update: { emailVerified: new Date() },
    create: {
      name: 'Admin',
      email: 'admin@medora.dev',
      password: hashed,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('Created admin user:', admin.email)

  const mathSubjects = [
    {
      name: 'Algebra',
      slug: 'algebra',
      description: 'Study of mathematical symbols and the rules for manipulating them',
      category: SubjectCategory.MATHEMATICS,
      color: '#8b5cf6',
      order: 1,
      subSubjects: [
        { name: 'Linear Algebra', slug: 'linear-algebra', description: 'Vector spaces, matrices, linear transformations' },
        { name: 'Abstract Algebra', slug: 'abstract-algebra', description: 'Groups, rings, fields, modules' },
        { name: 'Number Theory', slug: 'number-theory', description: 'Properties of integers, primes, congruences' },
        { name: 'Combinatorics', slug: 'combinatorics', description: 'Counting, permutations, graph theory' },
      ],
    },
    {
      name: 'Calculus & Analysis',
      slug: 'calculus-analysis',
      description: 'Study of continuous change and limits',
      category: SubjectCategory.MATHEMATICS,
      color: '#ec4899',
      order: 2,
      subSubjects: [
        { name: 'Real Analysis', slug: 'real-analysis', description: 'Sequences, series, continuity, differentiation' },
        { name: 'Complex Analysis', slug: 'complex-analysis', description: 'Analytic functions, contour integration' },
        { name: 'Differential Equations', slug: 'differential-equations', description: 'ODEs, PDEs, boundary value problems' },
        { name: 'Measure Theory', slug: 'measure-theory', description: 'Lebesgue measure, integration, probability' },
      ],
    },
    {
      name: 'Geometry & Topology',
      slug: 'geometry-topology',
      description: 'Study of shapes, spaces, and continuous deformations',
      category: SubjectCategory.MATHEMATICS,
      color: '#14b8a6',
      order: 3,
      subSubjects: [
        { name: 'Euclidean Geometry', slug: 'euclidean-geometry', description: 'Classical geometry of planes and solids' },
        { name: 'Differential Geometry', slug: 'differential-geometry', description: 'Manifolds, curvature, Riemannian geometry' },
        { name: 'Algebraic Topology', slug: 'algebraic-topology', description: 'Homotopy, homology, fundamental groups' },
        { name: 'General Topology', slug: 'general-topology', description: 'Topological spaces, continuity, compactness' },
      ],
    },
    {
      name: 'Logic & Foundations',
      slug: 'logic-foundations',
      description: 'Study of the foundations of mathematics',
      category: SubjectCategory.MATHEMATICS,
      color: '#f59e0b',
      order: 4,
      subSubjects: [
        { name: 'Set Theory', slug: 'set-theory', description: 'Axiomatic set theory, cardinal numbers' },
        { name: 'Mathematical Logic', slug: 'mathematical-logic', description: 'Propositional logic, predicate logic, incompleteness' },
        { name: 'Category Theory', slug: 'category-theory', description: 'Functors, natural transformations, universals' },
      ],
    },
  ]

  const physicsSubjects = [
    {
      name: 'Classical Mechanics',
      slug: 'classical-mechanics',
      description: 'Motion of physical objects under forces',
      category: SubjectCategory.PHYSICS,
      color: '#ef4444',
      order: 1,
      subSubjects: [
        { name: 'Newtonian Mechanics', slug: 'newtonian-mechanics', description: 'Laws of motion, conservation principles' },
        { name: 'Lagrangian Mechanics', slug: 'lagrangian-mechanics', description: 'Variational principles, generalized coordinates' },
        { name: 'Hamiltonian Mechanics', slug: 'hamiltonian-mechanics', description: 'Phase space, canonical transformations' },
      ],
    },
    {
      name: 'Electromagnetism',
      slug: 'electromagnetism',
      description: 'Study of electric and magnetic fields',
      category: SubjectCategory.PHYSICS,
      color: '#3b82f6',
      order: 2,
      subSubjects: [
        { name: 'Electrostatics', slug: 'electrostatics', description: 'Electric fields, potential, Gauss\'s law' },
        { name: 'Electrodynamics', slug: 'electrodynamics', description: 'Maxwell\'s equations, EM waves' },
        { name: 'Magnetostatics', slug: 'magnetostatics', description: 'Magnetic fields, Ampere\'s law' },
      ],
    },
    {
      name: 'Quantum Mechanics',
      slug: 'quantum-mechanics',
      description: 'Behavior of matter at atomic and subatomic scales',
      category: SubjectCategory.PHYSICS,
      color: '#10b981',
      order: 3,
      subSubjects: [
        { name: 'Wave Mechanics', slug: 'wave-mechanics', description: 'Schrödinger equation, wave functions' },
        { name: 'Quantum Operators', slug: 'quantum-operators', description: 'Observables, commutators, uncertainty' },
        { name: 'Quantum Statistics', slug: 'quantum-statistics', description: 'Fermi-Dirac, Bose-Einstein statistics' },
      ],
    },
    {
      name: 'Thermodynamics & Statistical Mechanics',
      slug: 'thermodynamics-statistical-mechanics',
      description: 'Heat, work, and the statistical behavior of systems',
      category: SubjectCategory.PHYSICS,
      color: '#f97316',
      order: 4,
      subSubjects: [
        { name: 'Laws of Thermodynamics', slug: 'laws-of-thermodynamics', description: 'Zeroth through third laws' },
        { name: 'Statistical Ensembles', slug: 'statistical-ensembles', description: 'Microcanonical, canonical, grand canonical' },
        { name: 'Kinetic Theory', slug: 'kinetic-theory', description: 'Boltzmann equation, transport phenomena' },
      ],
    },
    {
      name: 'Relativity',
      slug: 'relativity',
      description: 'Space, time, and gravitation',
      category: SubjectCategory.PHYSICS,
      color: '#a855f7',
      order: 5,
      subSubjects: [
        { name: 'Special Relativity', slug: 'special-relativity', description: 'Lorentz transformations, spacetime' },
        { name: 'General Relativity', slug: 'general-relativity', description: 'Einstein field equations, cosmology' },
      ],
    },
  ]

  for (const subjectData of [...mathSubjects, ...physicsSubjects]) {
    const { subSubjects, ...subjectInfo } = subjectData
    const subject = await prisma.subject.upsert({
      where: { slug: subjectInfo.slug },
      update: {},
      create: subjectInfo,
    })

    for (const sub of subSubjects) {
      await prisma.subSubject.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: sub.slug } },
        update: {},
        create: { ...sub, subjectId: subject.id },
      })
    }

    console.log(`Seeded: ${subject.name} with ${subSubjects.length} topics`)
  }

  const algebraSubject = await prisma.subject.findUnique({ where: { slug: 'algebra' } })
  const linearAlgebra = await prisma.subSubject.findFirst({
    where: { subjectId: algebraSubject!.id, slug: 'linear-algebra' },
  })

  const officialProof = await prisma.proof.upsert({
    where: { slug: 'proof-of-the-cayley-hamilton-theorem' },
    update: {},
    create: {
      title: 'Proof of the Cayley-Hamilton Theorem',
      slug: 'proof-of-the-cayley-hamilton-theorem',
      description: 'A comprehensive proof that every square matrix satisfies its own characteristic polynomial.',
      content: `## Theorem (Cayley-Hamilton)

Let $A$ be an $n \\times n$ matrix over a commutative ring $R$, and let

$$p_A(\\lambda) = \\det(\\lambda I - A) = \\lambda^n + c_{n-1}\\lambda^{n-1} + \\dots + c_1\\lambda + c_0$$

be its characteristic polynomial. Then

$$p_A(A) = A^n + c_{n-1}A^{n-1} + \\dots + c_1 A + c_0 I = 0$$

## Proof

We proceed in several steps.

### Step 1: The Adjugate Matrix

Recall that for any $n \\times n$ matrix $M$, we have

$$M \\cdot \\operatorname{adj}(M) = \\operatorname{adj}(M) \\cdot M = \\det(M) I$$

where $\\operatorname{adj}(M)$ is the adjugate (classical adjoint) of $M$.

### Step 2: Apply to $\\lambda I - A$

Let $B(\\lambda) = \\lambda I - A$. Then

$$B(\\lambda) \\cdot \\operatorname{adj}(B(\\lambda)) = \\det(B(\\lambda)) I = p_A(\\lambda) I$$

### Step 3: Expand the Adjugate

The entries of $\\operatorname{adj}(B(\\lambda))$ are polynomials in $\\lambda$ of degree at most $n-1$. Thus we can write

$$\\operatorname{adj}(B(\\lambda)) = \\lambda^{n-1} B_{n-1} + \\lambda^{n-2} B_{n-2} + \\dots + \\lambda B_1 + B_0$$

for some $n \\times n$ matrices $B_0, B_1, \\dots, B_{n-1}$ with entries in $R$.

### Step 4: Equate Coefficients

From Step 2:

$$(\\lambda I - A)(\\lambda^{n-1} B_{n-1} + \\dots + B_0) = (\\lambda^n + c_{n-1}\\lambda^{n-1} + \\dots + c_0)I$$

Expanding and comparing coefficients of $\\lambda^k$:

$$\\begin{aligned}
\\lambda^n &: B_{n-1} = I \\\\
\\lambda^{n-1} &: B_{n-2} - A B_{n-1} = c_{n-1} I \\\\
\\lambda^{n-2} &: B_{n-3} - A B_{n-2} = c_{n-2} I \\\\
&\\ \\ \\vdots \\\\
\\lambda^1 &: B_0 - A B_1 = c_1 I \\\\
\\lambda^0 &: -A B_0 = c_0 I
\\end{aligned}$$

### Step 5: Construct $p_A(A)$

Multiply the $k$-th equation by $A^k$ (starting from $k=0$) and sum:

$$\\begin{aligned}
A^n B_{n-1} &= A^n \\\\
A^{n-1}(B_{n-2} - A B_{n-1}) &= A^{n-1} c_{n-1} I \\\\
&\\ \\ \\vdots \\\\
A(B_0 - A B_1) &= A c_1 I \\\\
-A B_0 &= c_0 I
\\end{aligned}$$

Adding all these equations, the left-hand side telescopes to $0$, giving:

$$A^n + c_{n-1} A^{n-1} + \\dots + c_1 A + c_0 I = 0$$

Thus $p_A(A) = 0$, completing the proof.

## Remarks

This theorem is fundamental in linear algebra and has many important consequences, including the fact that the minimal polynomial of a matrix divides its characteristic polynomial.`,
      type: 'OFFICIAL',
      isPublished: true,
      authorId: admin.id,
      subjectId: algebraSubject!.id,
      subSubjectId: linearAlgebra!.id,
    },
  })

  console.log('Created official proof:', officialProof.title)
  console.log('\\nSeed completed!')
  console.log('Admin login: admin@medora.dev / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
