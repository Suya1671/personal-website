{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.default = pkgs.mkShell rec {
        LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
        nativeBuildInputs = with pkgs; [
          nil
          nodejs_22
          alejandra
          nodePackages.svelte-language-server
          nodePackages.pnpm
          nodePackages.typescript-language-server
          marksman
          pkgs.stdenv.cc.cc.lib
        ];
      };
    });
}
