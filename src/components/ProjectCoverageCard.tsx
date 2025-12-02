import React from 'react';
import { Card, CardContent, CardHeader, Typography, Chip, Box, LinearProgress, Stack } from '@mui/material';
import { ProjectCoverage } from '../Types';

interface MetricProps {
  label: string;
  value: number;
}

const Metric: React.FC<MetricProps> = ({ label, value }) => (
  <Stack spacing={0.25}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value.toFixed(1)}%
    </Typography>
  </Stack>
);

const languageColor: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  react: 'primary',
  javascript: 'warning',
  typescript: 'info',
  java: 'warning',
  python: 'success',
};

// language → chip color + accent color
const languageChipColor: Record<
  string,
  'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'default'
> = {
  react: 'primary',
  javascript: 'warning',
  typescript: 'info',
  java: 'secondary',
  python: 'success',
};

const languageAccentColor: Record<string, string> = {
  react: '#2563eb',      // blue
  javascript: '#1c8bbfff', // amber
  typescript: '#0b79acff', // cyan
  java: '#5592c0ff',       // orange
  python: '#16a34a',     // green
};

// coverage% → color (for text/progress)
function coverageColor(pct: number): string {
  if (pct >= 90) return '#16a34a'; // green-600
  if (pct >= 75) return '#f59e0b'; // amber-500
  if (pct >= 50) return '#f97316'; // orange-500
  return '#dc2626';                // red-600
}

const ProjectCoverageCard: React.FC<ProjectCoverage> =({  
  projectInfo,
  coverage,
  total
}) => {
  const { projectName, language, framework, coverageReportLink } = projectInfo;

  const lines = coverage?.lines ?? 0;
  const statements = coverage?.statements ?? 0;
  const branches = coverage?.branches ?? 0;
  const functions = coverage?.functions ?? 0;

  const langKey = (language || '').toLowerCase();
  const chipColor = languageChipColor[langKey] || 'default';
  const accentColor = languageAccentColor[langKey] || '#0f172a';

  const covColor = coverageColor(lines); // based on line coverage

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
        border: '1px solid rgba(148,163,184,0.35)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 14px 30px rgba(15,23,42,0.12)',
          borderColor: 'rgba(59,130,246,0.6)',
        },
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            noWrap
            sx={{ color: accentColor, fontWeight: 600 }}
          >
            {projectName}
          </Typography>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {language && (
              <Chip
                size="small"
                label={language}
                color={chipColor}
                variant="outlined"
              />
            )}
            {framework && (
              <Chip
                size="small"
                label={framework}
                variant="outlined"
                sx={{ borderColor: '#e2e8f0' }}
              />
            )}
          </Stack>
        }
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Overall Line Coverage */}
        <Box mb={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5}
          >
            <Typography variant="body2" color="text.secondary">
              Line coverage
            </Typography>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ color: covColor }}
            >
              {lines.toFixed(1)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, lines))}
            sx={{
              height: 8,
              borderRadius: 999,
              backgroundColor: '#e2e8f0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                backgroundColor: covColor,
              },
            }}
          />
        </Box>

        {/* Metrics */}
        <Box mt={1}>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            <Metric label="Statements" value={statements} />
            <Metric label="Branches" value={branches} />
            <Metric label="Functions" value={functions} />
            <Metric label="Lines" value={lines} />
          </Stack>
        </Box>

        {/* Report link */}
        {coverageReportLink && (
          <Box mt={2}>
            <Typography
              variant="body2"
              component="a"
              href={coverageReportLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              View coverage report ↗
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default ProjectCoverageCard;
