// ============================================================//
//  Dashboard.jsx — ROLE-BASED DASHBOARD ROUTER                //
//  switch(currentUser.role) renders different dashboards      //
//  Admin / Engineering / Approver / Operations                //
// ============================================================//
import { useApp } from '../context/AppContext';
import AdminDashboard from './dashboards/AdminDashboard';
import EngineeringDashboard from './dashboards/EngineeringDashboard';
import ApproverDashboard from './dashboards/ApproverDashboard';
import OperationsDashboard from './dashboards/OperationsDashboard';

export default function Dashboard() {
  const { currentUser } = useApp();

  switch (currentUser.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Engineering User':
      return <EngineeringDashboard />;
    case 'Approver':
      return <ApproverDashboard />;
    case 'Operations User':
      return <OperationsDashboard />;
    default:
      return <EngineeringDashboard />;
  }
}
