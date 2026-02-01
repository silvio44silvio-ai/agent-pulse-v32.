
# 🚀 AgentPulse AI - Deploy Ready (v34.0)

Plataforma de LeadGen de alta performance utilizando **Google Gemini** e **React 19 Stable**.

## 🌐 Deploy Rápido (Vercel)

### 1. Preparação do Repositório
Certifique-se de que todos os arquivos foram commitados, incluindo o novo `vercel.json` e o `vite.config.ts` atualizado.

### 2. Configurações no Dashboard da Vercel
Ao criar o projeto na Vercel, adicione as seguintes **Environment Variables**:

| Variável | Valor | Finalidade |
| :--- | :--- | :--- |
| `API_KEY` | `SUA_CHAVE_GEMINI` | Ativa o Social Radar e IA Assistant |
| `NPM_CONFIG_LEGACY_PEER_DEPS` | `false` | Força a estrita conformidade com React 19 |

### 3. Build Settings
* **Framework Preset**: Vite
* **Build Command**: `npm run build`
* **Output Directory**: `dist`

## 🧪 Teste Pós-Deploy
Após o término do build, verifique:
1.  **Acesso**: Se a tela de Login Alpha carrega sem erros de console.
2.  **Radar**: Realize uma busca para confirmar que a `API_KEY` foi injetada e o grounding (Google Search) está ativo.
3.  **Responsividade**: Teste o menu mobile para garantir que os z-index do glassmorfismo estão corretos.

## 🛡️ Segurança Rodney Alpha
O arquivo `vercel.json` inclui cabeçalhos de segurança que impedem Clickjacking e Sniffing de MIME-type, mantendo a integridade dos dados dos seus leads.

---
*Rodney Alpha v34.0 - Protocolo de Lançamento Estável.*
# agent-pulse-v32.
# agent-pulse-ai.
# RodneyAlphav51.2.1
# RodneyAlphav51.2.1
# agentpulse-ai
