
/**
 * AgentPulse Alpha - Mock Service Layer
 * Este arquivo substitui o Firebase para permitir execução 100% local.
 */

export const auth: any = {
  currentUser: null,
  signOut: async () => {
    localStorage.removeItem('agentPulseProfile');
    return Promise.resolve();
  }
};

export const db: any = {
  // Mock para Firestore se necessário por outros componentes
  collection: (path: string) => ({
    path,
    add: async (data: any) => {
      const current = JSON.parse(localStorage.getItem(`local_db_${path}`) || '[]');
      const newItem = { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date().toISOString() };
      localStorage.setItem(`local_db_${path}`, JSON.stringify([newItem, ...current]));
      return Promise.resolve(newItem);
    }
  })
};

export default { auth, db };
