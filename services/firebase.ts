
/**
 * AgentPulse Alpha - Firebase Bridge
 * Para produção, substitua os valores abaixo pelas chaves do seu console.firebase.google.com
 */

// Mock de transição - Permite funcionamento local mas avisa sobre persistência
export const auth: any = {
  currentUser: null,
  signOut: async () => {
    localStorage.removeItem('agentPulseProfile');
    localStorage.removeItem('agentPulseLeads');
    return Promise.resolve();
  }
};

export const db: any = {
  collection: (path: string) => ({
    path,
    add: async (data: any) => {
      console.log(`Rodney Log: Persistindo em ${path} (Local Storage Mode)`);
      const current = JSON.parse(localStorage.getItem(`local_db_${path}`) || '[]');
      const newItem = { 
        id: Math.random().toString(36).substring(2, 9).toUpperCase(), 
        ...data, 
        createdAt: new Date().toISOString() 
      };
      localStorage.setItem(`local_db_${path}`, JSON.stringify([newItem, ...current]));
      return Promise.resolve(newItem);
    }
  })
};

export default { auth, db };
