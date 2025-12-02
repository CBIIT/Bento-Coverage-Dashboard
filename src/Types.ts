export interface CoverageMetrics {
  lines?: number;
  statements?: number;
  branches?: number;
  functions?: number;
}

export interface ProjectInfo {
  id?: string;
  parentProject?: string;
  projectName: string;
  coerageReportLink: string;
}

export interface ProjectCoverage {
  projectInfo: ProjectInfo;
  coverage: CoverageMetrics;
  total?: any;
}

export interface CoverageSummary {
  generatedAt?: string;
  projects: ProjectCoverage[];
}
