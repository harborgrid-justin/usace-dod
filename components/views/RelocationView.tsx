import React from 'react';
import RelocationDashboard from '../remis/RelocationDashboard';
import { RelocationDashboardProps } from '../../types';

// This view acts as a wrapper for the main RelocationDashboard component.
// The `RelocationView.tsx` file was empty, and `App.tsx` loads `RelocationDashboard` for this tab,
// so this component bridges that gap.

const RelocationView: React.FC<RelocationDashboardProps> = (props) => {
    return <RelocationDashboard {...props} />;
};

export default RelocationView;
