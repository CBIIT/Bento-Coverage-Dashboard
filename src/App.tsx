import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, Grid, Divider } from '@mui/material';
import { CoverageMetrics, ProjectCoverage, ProjectInfo } from './Types';
import { ProjectsConfig } from './config/projects';
import ProjectCoverageCard from './components/ProjectCoverageCard';
import { parseJacocoXml } from './utils/Java';

export const getJavascriptCoverageInfo = async (
  config: ProjectInfo
): Promise<ProjectCoverage> => {
    const result: ProjectCoverage = {
        projectInfo: config
    };
    if (config.framework === 'react') {
        const res = await fetch(config.coverageReportLink, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed ${config.id}: ${res.status}`);
        const data = (await res.json()) as any;
        console.log(data);
        const converageInfo: CoverageMetrics = {
          lines: data?.total?.lines?.pct,
          statements: data?.total?.statements?.pct,
          branches: data?.total?.branches?.pct,
          functions: data?.total?.functions?.pct,
        }
        result.coverage = converageInfo;
    }

    return result;
};

export const getJavaCoverageInfo = async (
  config: ProjectInfo
): Promise<ProjectCoverage> => {
    const result: ProjectCoverage = {
      projectInfo: config
    };
    if (config.framework === 'spring') {
      const res = await fetch(config.coverageReportLink, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`JaCoCo XML fetch failed for ${config.id}: ${res.status}`);
      }
      const xmlText = await res.text();
      const cov = parseJacocoXml(xmlText);
      result.coverage = cov;
    }
    return result;
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCoverage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('react effort');
    async function load() {
      try {
        const results: ProjectCoverage[] = [];
        for (const config of ProjectsConfig) {
            if (config.language == 'javascript') {
              const javascriptCoverageInfo = await getJavascriptCoverageInfo(config);
              results.push(javascriptCoverageInfo);
            }
            if (config.language == 'java') {
              const javaCoverageInfo = await getJavaCoverageInfo(config);
              results.push(javaCoverageInfo);
            }
        }
        setProjects(results);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load coverage data');
        setLoading(false);
      }
    };
    load();
  }, []);

  if (projects.length === 0) {
    return (
      <>
        Projects not found.
      </>
    );
  }

  // grouped by parent project
  const grouped: Record<string, ProjectCoverage[]> = {};
  for (const p of projects) {
    const parent = p.projectInfo.parentProject || 'Ungrouped';
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(p);
  }
  const parentNames = Object.keys(grouped).sort();
  console.log(parentNames);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Bento Coverage Hub
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Multi-language coverage dashboard (React, Java, Python), grouped by Bento parent project.
        </Typography>
      </Box>

      {parentNames.map((parent, idx) => (
        <Box key={parent} mb={4}>
          {idx > 0 && <Divider sx={{ mb: 2 }} />}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {parent}
          </Typography>

          <Grid container spacing={2}>
            {grouped[parent].map((proj) => (
              <Grid item key={proj.projectInfo.id || proj.projectInfo.projectName} xs={12} sm={6} md={4} lg={3}>
                <ProjectCoverageCard
                  key={proj.projectInfo.id}
                  projectInfo={proj.projectInfo}
                  coverage={proj.coverage}
                  total={proj.total}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
    </>
  );
};

export default App;
