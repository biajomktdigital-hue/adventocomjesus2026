# Advento com Jesus V4 enxuta — deploy no Vercel

Projeto Vite + React pronto para implantação.

## Pelo painel do Vercel

1. Envie esta pasta para um repositório no GitHub, GitLab ou Bitbucket.
2. No Vercel, escolha **Add New > Project**.
3. Importe o repositório.
4. O Vercel reconhecerá o Vite e usará as configurações de `vercel.json`.
5. Clique em **Deploy**.

## Pela CLI do Vercel

Dentro desta pasta, execute:

```bash
vercel
```

Para publicar em produção:

```bash
vercel --prod
```

## Configurações incluídas

- Build: `pnpm run build`
- Saída: `dist`
- Checkouts GGCheckout configurados
- Script de UTMs da UTMify instalado no `index.html`
- Arquivos de código, imagens e fontes no mesmo nível da pasta, mantendo o formato plano que já funcionou no Vercel
- Imagem social `social-preview.png` configurada
- Pixel de otimização e script de UTMs da UTMify preservados

Antes de divulgar a página, configure a integração nativa da UTMify nos dois checkouts e substitua os links pendentes de Termos de Uso e Política de Privacidade.
