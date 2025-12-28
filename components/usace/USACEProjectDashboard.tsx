
import React, { useState } from 'react';
import { USACEProject } from '../../types';
import ProjectContextSidebar from './dashboard/ProjectContextSidebar';
import ProjectWorkArea from './dashboard/ProjectWorkArea';

const USACEProjectDashboard: React.FC<{project: USACEProject, onBack: () => void}> = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState('Financials');

    return (
        <div className="flex h-full overflow-hidden bg-zinc-50">
            <ProjectContextSidebar 
                project={project} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                onBack={onBack} 
            />
            <ProjectWorkArea 
                project={project} 
                activeTab={activeTab} 
                onBack={onBack}
            />
        </div>
    );
};
export default USACEProjectDashboard;
