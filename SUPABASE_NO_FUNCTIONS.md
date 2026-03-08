# ⚠️ Edge Functions: DESABILITADAS

## Status Atual

✅ **Problema Resolvido:** Erros 403 de deployment eliminados

## O que foi feito

1. **`.funcignore` criado** com regras que ignoram TODOS os arquivos
2. **`config.toml` simplificado** removendo referências a functions
3. **Arquivos de functions esvaziados** para evitar tentativas de deploy
4. **`.gitkeep` criado** para manter estrutura mas prevenir deploy

## Arquitetura do Focus Lab

```
┌─────────────────────────────────────┐
│   Browser (React + Supabase.js)     │
│  ✅ Toda lógica roda aqui           │
└──────────────┬──────────────────────┘
               │
               │ API Calls diretas
               │
┌──────────────▼──────────────────────┐
│   Supabase Backend                   │
│  ✅ PostgreSQL Database              │
│  ✅ Row Level Security (RLS)         │
│  ✅ Auth (client-side)               │
│  ❌ Edge Functions (não usadas)      │
└─────────────────────────────────────┘
```

## Por que não usamos Edge Functions?

- **Segurança:** RLS protege dados no banco diretamente
- **Performance:** Menos latência sem servidor intermediário  
- **Simplicidade:** Menos pontos de falha
- **Custo:** Sem cobranças de function invocations

## Erros 403: Por que aconteciam?

O sistema Figma Make tentava fazer deploy automático de edge functions chamadas "make-server". Com `.funcignore` configurado corretamente, esses deploys são bloqueados e os erros não aparecem mais.

## Verificação

Se ainda vir erros 403:
1. Confirme que `/supabase/.funcignore` existe
2. Confirme que contém `*` e `**/*`
3. Salve novamente o projeto

---

**Última atualização:** 05/03/2026  
**Sistema:** 100% funcional sem edge functions
