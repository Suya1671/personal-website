{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    nodejs.enable = true;
    corepack.enable = true;
    pnpm.enable = true;
    pnpm.install.enable = true;
  };

  languages.typescript.enable = true;

  languages.nix.enable = true;
}
