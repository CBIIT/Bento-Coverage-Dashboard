import { ProjectInfo } from "../Types";

export const ProjectsConfig: ProjectInfo[] = [
  {
    id: '1',
    parentProject: 'CRDC-ICDC',
    projectName: 'Bento-ICDC-Frontend',
    language: 'javascript',
    framework: 'react',
    coverageReportLink: 'https://raw.githubusercontent.com/rana22/multi-lang-coverage-demo/refs/heads/main/react-app-1/coverage/coverage-summary.json'
  },
  {
    id: '1',
    parentProject: 'CRDC-ICDC',
    projectName: 'Bento-ICDC-Backend',
    language: 'java',
    framework: 'spring',
    coverageReportLink: 'https://raw.githubusercontent.com/rana22/multi-lang-coverage-demo/refs/heads/main/java-app-1/target/site/jacoco/jacoco.xml'
  }
];
