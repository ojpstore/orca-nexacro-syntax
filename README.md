# Nexacro

Syntax highlighting for Nexacro files (`.xfdl` `.xadl` `.xprj` `.xjs`); regenerate grammars with `node build.mjs`. Edit the grammar in `syntaxes/`.

## Develop

```sh
orca plugin validate .
orca plugin dev watch .    # loads this folder into Orca and prints its logs and reloads; Ctrl-C unloads it
```

Orca names the publisher after where the plugin is installed from: the GitHub or GitLab owner of
its repository, or `local` for a folder. See
https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md.
