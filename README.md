# Cuzinho hoje? ♡

Versão atualizada do site.

## O que foi corrigido

O botão "NÃO" foi removido de dentro do card e colocado diretamente no `<body>`.
Isso evita que `backdrop-filter`, `overflow` ou outros estilos do card criem um containing block/clipping para o `position: fixed`.

O botão também usa `pointer-events: none`, então o cursor nunca consegue realmente passar o evento para o botão. O movimento é controlado pelo `pointermove` global.

## Arquivos

- `index.html`
- `style.css`
- `script.js`
