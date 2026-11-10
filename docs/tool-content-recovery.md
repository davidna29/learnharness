# Tool-content display recovery

This is a developer reference for display-only recovery of model-authored escaping defects, not a general TeX repair system.

## Boundary

Tool arguments are shape-decoded, schema-converted, validated, and cleaned **before** presentation. `ToolContentResponse` then applies `repairMathForDisplay` and ordinary Markdown rendering. Teaching/probing questions, asks, recalls/explanations, and practice statements/solutions share this path; ordinary assistant prose does not.

Recovery must not change persisted arguments, option identities, shuffling, grading, learner answers, or future answer snapshots. Those use source-derived, schema-parsed content.

## Supported recovery

| Content | Behavior |
| --- | --- |
| Literal code | Copy CommonMark/math-parser source ranges verbatim, including fences, indentation, quotes, and lists. Do not serialize a replacement AST. |
| Document escapes | Decode literal `\n` only with evidence such as repeated layout escapes or accompanying extra-escaped TeX. Protect code, recognized paths, comments, and complete known n-prefixed commands/macros such as `\nu` and `\nabla`. |
| Display framing | Recovered `$$` framing puts the formula and closing fence on their own lines. |
| JSON-swallowed prefixes | In math, reconstruct control-character + complete alphabetic word only when it names a known KaTeX command, such as TAB + `ext` → `\text`. |
| Extra command escaping | Recover known commands using original TeX context; unknown words are not invented. Preserve genuine native row separators/comments; consistently over-escaped environments establish a factor for commands **and rows**. |
| Percentages | Recover supported doubled percent escapes in numeric expressions, including at the end of display math; preserve genuine comments/rows. No blanket percent repair. |

Inline prefix recovery includes physical LF + `u` → `\nu` and TAB + `o` → `\to`, with no word-length cutoff. Display math keeps physical LF/CRLF as formatting but can recover recognized non-newline prefixes. Correctly written commands remain commands; unrelated whitespace stays unchanged.

This policy deliberately targets typical model-authored math: whitespace followed by a variable can ambiguously spell a command. TeX parse success cannot resolve that ambiguity. A guard rejects partial command changes that introduce a parse failure, but parse success alone does not prove semantic preservation. Unbalanced/unsupported content is not generally rewritten into new mathematics; there are no language-specific decoders.

In labelled answer/Why reveals, only the first direct paragraph is inline with its label; later paragraphs keep normal layout.

### Escaped code fences

Some providers leave a fenced code block inside an undecoded JSON string, so its line breaks arrive as literal `\n`. On the raw single line CommonMark reads the whole fence as one inline-code span, and the code barrier would otherwise keep every escape visible — the question renders compressed with a raw language tag (issues #209, #467, #488). Recovery therefore decodes one whole fence pair's separators and line breaks before framing it as a block. Backslash runs keep JSON pairing: `\\n` stays a literal C `\n`; only an odd run becomes a newline. Inline code and spans that are not a complete fence pair are never decoded.

The escaped fence also identifies a **whole-string JSON layer**: when the entire tool text still carries escaped newlines AND escaped quotes/backslashes, it is decoded once with JSON parsing before Markdown. This restores `"` in code and prose while preserving an author's C/LaTeX backslashes (`\\n` becomes a literal `\n`, `\\` one backslash). A text with physical newlines cannot be a JSON string and stays on the fence-only path. Stored tool arguments, option identities and answers remain untouched.

### Document escapes

A literal two-character `\n` is different from a physical newline. Document-layout recovery requires evidence such as repeated document-escape candidates or a candidate alongside over-escaped known TeX commands. Complete known n-prefixed TeX words, including `\nu`, `\nabla`, `\neq` and declared n-prefixed macros, take precedence over interpreting their prefix as document layout. Code, genuine TeX comments and recognized path tokens are protected.

Recovered double-dollar display framing puts the formula and closing fence on their own lines. Decoding the opening line alone can otherwise turn closing dollars into erroneous TeX content.

### JSON-swallowed command prefixes

Inside math, a control character can be the result of JSON consuming the start of a command: TAB + `ext` instead of `\text`, for example. Recovery reconstructs a command only if the control character plus the **complete following alphabetic word** names a known KaTeX command. All supported occurrences recover in one projection.

The owner-approved typical-model-authoring policy is:

- **Inline math:** recover recognized prefixes, including physical LF + `u` to `\nu`, and TAB + `o` to `\to`. There is no word-length cutoff.
- **Display math:** keep physical LF and CRLF as source formatting; recover recognized non-newline prefixes.
- **Correctly written commands:** remain commands in both modes. `\nu` is never decoded into LF + `u`.
- **Unrecognized whitespace:** remains unchanged. `x<TAB>+<TAB>y` does not become invented `\t`/`\ty` commands.

The control-character case is inherently ambiguous: whitespace followed by a variable may happen to spell a command. This policy targets typical model-authored LaTeX, not every syntactically possible human whitespace arrangement. TeX parse success alone cannot distinguish the two meanings.

### Extra command escaping, percentages and rows

Recovery examines the original TeX context before changing backslash runs:

- Complete native environment pairs and native `\substack` arguments preserve genuine row separators.
- Consistently extra-escaped environment pairs establish an escaping factor for commands **and rows**. For example, an encoded four-backslash row becomes two backslashes, not one.
- Outside protected native row/comment contexts, extra prefixes on known commands can recover. Unknown command words are not invented.
- Doubled percent escapes in ordinary numeric expressions can recover to `\%`, including numeric percentages at the end of a display formula. Genuine following comment text or equation rows remain literal. This is not a blanket `%` addition to an even-backslash rule.
- As an additional guard, partial command recovery does not turn parseable source into a TeX parse failure. Parse success is not the primary correctness test: both a corrupted matrix and a lost percentage can parse successfully.

- Unbalanced, unsupported or ambiguous content is not generally corrected into new mathematics. This is an escaping recovery projection, not a general TeX authoring repair system. There are no language-specific decoders.

## Historical answers

`answerForPresentation` joins display fields to original calls without rewriting answer facts. Labels bind through unambiguous selected values, exact/source-recovered labels, or the uniquely remaining pair in a complete bijection. Ambiguous rows keep saved snapshots. Order, indices, values, verdicts, confidence, learner text, and dismissals remain intact. No migration is performed.

## Verification

- `tests/content-recovery.test.ts`: recovery/preservation, code, rows, and comments.
- `tests/tool-content-presentation.test.tsx`: synthetic corpus, historical joins, ambiguity.
- `tests/tool-content-interaction.test.tsx`: selection/submission/persistence/reveal and paragraphs.

`scripts/replay-tool-rendering-corpus.ts` can replay a separately supplied frozen corpus offline, checking hashes and source/render/answer preservation. Corpus collection and larger diagnostic runs are not prerequisites for unit tests. The Markdown, card, practice, shape, and grading suites remain relevant.
