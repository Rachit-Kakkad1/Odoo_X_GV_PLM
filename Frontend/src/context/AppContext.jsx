// ============================================================//
//  AppContext.jsx — THE BRAIN OF THE APP                      //
//  ALL state + ALL business logic lives here                  //
//  Every page calls useApp() to access this data              //
// ============================================================//

import { createContext, useContext, useState, useCallback } from 'react';
import { users, products as initialProducts, boms as initialBoms, ecos as initialEcos, notifications as initialNotifications, ROLES } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {

  // ================================//
  //  GLOBAL STATE — All app data    //
  // ================================//
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products] = useState(initialProducts);
  const [bomList, setBomList] = useState(initialBoms);
  const [ecoList, setEcoList] = useState(initialEcos);
  const [notificationList, setNotificationList] = useState(initialNotifications);

  // ================================//
  //  ROLE SWITCHER (demo feature)   //
  // ================================//
  const switchRole = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  }, []);

  // ==========================================//
  //  LOGIN / LOGOUT — Auth state              //
  // ==========================================//
  const login = useCallback((userId) => {
    switchRole(userId);
    setIsAuthenticated(true);
  }, [switchRole]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  // ===========================================//
  //  PERMISSION FLAGS — Role-based access      //
  //  These control what UI each role can see    //
  // ===========================================//
  const canCreateEco = currentUser.role === ROLES.ENGINEERING || currentUser.role === ROLES.ADMIN;
  const canEditDraft = currentUser.role === ROLES.ENGINEERING || currentUser.role === ROLES.ADMIN;
  const canApprove = currentUser.role === ROLES.APPROVER || currentUser.role === ROLES.ADMIN;
  const canAccessSettings = currentUser.role === ROLES.ADMIN;
  const isReadOnly = currentUser.role === ROLES.OPERATIONS;

  // ================================//
  //  ADD BOM — Create new BoM       //
  // ================================//
  const addBom = useCallback((bom) => {
    const newBom = {
      ...bom,
      id: `bom${Date.now()}`,
      version: '1',
      status: 'Draft',
      createdAt: new Date().toISOString().slice(0, 10),
      components: (bom.components || []).map(c => ({
        ...c,
        unit: c.unit || 'pcs',
        cost: c.cost || 0
      })),
      operations: bom.operations || []
    };
    setBomList(prev => [newBom, ...prev]);
    return newBom;
  }, []);

  // ==========================================//
  //  ADD ECO — Create new ECO (auto-numbers)  //
  // ==========================================//
  const addEco = useCallback((eco) => {
    const newEco = {
      ...eco,
      id: `eco${Date.now()}`,
      ecoNumber: `ECO-2026-${String(ecoList.length + 1).padStart(3, '0')}`,
      stage: 'New',
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString().slice(0, 10),
      approvalLogs: [],
      attachedImages: eco.attachedImages || [],
      imageChanges: eco.imageChanges || [],
    };
    setEcoList(prev => [newEco, ...prev]);
    return newEco;
  }, [currentUser, ecoList.length]);

  // ===============================================//
  //  UPDATE ECO STAGE — Used for BOTH              //
  //  Submit for Approval AND Approve                //
  // ===============================================//
  const updateEcoStage = useCallback((ecoId, newStage, comment = '') => {
    setEcoList(prev => prev.map(eco => {
      if (eco.id !== ecoId) return eco;
      const logEntry = {
        user: currentUser.name,
        action: newStage === 'Approval' ? 'Submitted for Approval' : newStage === 'Done' ? 'Approved' : `Moved to ${newStage}`,
        timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        comment,
      };
      return { ...eco, stage: newStage, approvalLogs: [...eco.approvalLogs, logEntry] };
    }));
  }, [currentUser]);

  // ==========================================//
  //  REJECT ECO — Resets stage back to 'New'  //
  // ==========================================//
  const rejectEco = useCallback((ecoId, comment = '') => {
    setEcoList(prev => prev.map(eco => {
      if (eco.id !== ecoId) return eco;
      const logEntry = {
        user: currentUser.name,
        action: 'Rejected',
        timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        comment,
      };
      return { ...eco, stage: 'New', approvalLogs: [...eco.approvalLogs, logEntry] };
    }));
  }, [currentUser]);

  const updateEcoImages = useCallback((ecoId, images) => {
    setEcoList(prev => prev.map(eco =>
      eco.id === ecoId ? { ...eco, attachedImages: images } : eco
    ));
  }, []);

  // ==========================================//
  //  REVIEW IMAGE — Approve/Reject images     //
  // ==========================================//
  const reviewEcoImage = useCallback((ecoId, imageChangeId, status, comment) => {
    setEcoList(prev => prev.map(eco => {
      if (eco.id !== ecoId) return eco;
      const updatedChanges = (eco.imageChanges || []).map(ic =>
        (ic.id === imageChangeId) ? { ...ic, reviewStatus: status, reviewComment: comment || '', reviewedBy: currentUser.name } : ic
      );
      return { ...eco, imageChanges: updatedChanges };
    }));
  }, [currentUser]);

  // ==========================================//
  //  NOTIFICATIONS — Mark as read             //
  // ==========================================//
  const markNotificationRead = useCallback((notifId) => {
    setNotificationList(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  }, []);

  // ==========================================//
  //  CONTEXT VALUE — Everything exported      //
  // ==========================================//
  const value = {
    isAuthenticated,
    login,
    logout,
    currentUser,
    users,
    switchRole,
    products,
    bomList,
    ecoList,
    addEco,
    addBom,
    updateEcoStage,
    rejectEco,
    updateEcoImages,
    reviewEcoImage,
    notificationList,
    markNotificationRead,
    canCreateEco,
    canEditDraft,
    canApprove,
    canAccessSettings,
    isReadOnly,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ==========================================//
//  useApp() — Hook to access this context   //
//  Call this in any component to get data   //
// ==========================================//
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
