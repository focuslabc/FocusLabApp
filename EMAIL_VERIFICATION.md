# 📧 Como Funciona a Verificação de Email

## ✅ Sistema Configurado

O Focus Lab já está configurado para funcionar automaticamente! Quando você fizer o deploy:

### O que acontece:

1. **Usuário se cadastra** → Sistema envia email de confirmação
2. **Usuário clica no link** → Redirecionado automaticamente para a aplicação
3. **Login automático** → Pronto para usar!

## 🔧 URL Automática

O sistema usa `window.location.origin` automaticamente, então:
- Em localhost: `http://localhost:porta`
- Em produção: A URL onde estiver hospedado (gerada automaticamente pelo Figma Make)

**Não precisa configurar nada manualmente!**

## ⚠️ Única Configuração Necessária (No Supabase)

Quando a aplicação estiver online, você precisa adicionar a URL dela no Supabase:

1. Veja qual URL o Figma Make gerou para sua aplicação
2. Copie essa URL
3. Acesse https://supabase.com/dashboard → seu projeto
4. Vá em **Authentication** → **URL Configuration**
5. Cole a URL na lista de **Redirect URLs**
6. Salve

**Exemplo:**
Se o Figma Make gerou: `https://abc123.figma.app`
Adicione: `https://abc123.figma.app` no Supabase

## 🎯 Resultado

Depois disso, tudo funcionará perfeitamente:
- ✅ Cadastro online
- ✅ Email de confirmação
- ✅ Redirecionamento correto
- ✅ Login automático

---

**IMPORTANTE:** Você só precisa fazer isso **DEPOIS** que o app estiver online e você souber a URL gerada.
