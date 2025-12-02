import React, { useState } from 'react';
import { ProjectCoverage } from './Types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCoverage[]>([]);

  React.useEffect(() => {
    console.log('react effort');
  }, []);

  return (
    <>
      App component 123456
    </>
  );
};

export default App;
