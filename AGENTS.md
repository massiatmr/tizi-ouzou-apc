<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep homepage display and body typography in the global font tokens, and load their web fonts in the root head so all sections share the same identity.
- Keep supplemental homepage Tifinagh copy in a browser-safe dictionary and resolve it from the selected language, including accessible labels, so all sections switch together.
- Keep page motion in a browser-only hook with frame-coalesced scroll/pointer updates and CSS variables; respect reduced motion and fine-pointer capabilities to preserve accessibility and mobile performance.
