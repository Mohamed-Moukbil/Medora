-- CreateTable
CREATE TABLE "SavedProof" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proofId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofVersion" (
    "id" TEXT NOT NULL,
    "proofId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProofVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedProof_userId_proofId_key" ON "SavedProof"("userId", "proofId");

-- CreateIndex
CREATE INDEX "SavedProof_userId_idx" ON "SavedProof"("userId");

-- CreateIndex
CREATE INDEX "ProofVersion_proofId_idx" ON "ProofVersion"("proofId");

-- CreateIndex
CREATE INDEX "ProofVersion_proofId_version_idx" ON "ProofVersion"("proofId", "version");

-- AddForeignKey
ALTER TABLE "SavedProof" ADD CONSTRAINT "SavedProof_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProof" ADD CONSTRAINT "SavedProof_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofVersion" ADD CONSTRAINT "ProofVersion_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "Proof"("id") ON DELETE CASCADE ON UPDATE CASCADE;
