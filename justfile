# See https://github.com/sablier-labs/devkit/blob/main/just/base.just
import "./node_modules/@prb/devkit/just/base.just"

# Package modules
mod evm "evm"

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Default: show all recipes
default:
    just --list

build package:
    cd {{ package }} && just build
alias b := build

# Build all packages
@build-all:
    cd evm && just build
    echo ""

    echo '{{ GREEN }}✓ All packages built{{ NORMAL }}'
alias ba := build-all

# Bump beta version using jq (e.g., just bump-beta evm)
@bump-beta app:
    cd {{ app }} && jq '.version |= (split("-beta.") | .[0] + "-beta." + ((.[1] | tonumber) + 1 | tostring))' package.json > tmp.json && mv tmp.json package.json
    jq -r .version {{ app }}/package.json
alias bb := bump-beta

# Clean build artifacts
@clean:
    echo "🧹 Deleting files..."
    nlx del-cli --verbose \
        "**/dist" \
        "**/*.tsbuildinfo" \
        "**/*.tgz"

# ---------------------------------------------------------------------------- #
#                                     TESTS                                    #
# ---------------------------------------------------------------------------- #

# Run unit tests
[group("tests")]
@test-unit +args="":
    na vitest --exclude '**/*.test.integration.ts' {{ args }}
alias t := test-unit
alias tu := test-unit

# Run integration tests without loading secrets
[group("tests")]
@test-integration +args="":
    na vitest run --exclude '**/*.test.ts' {{ args }}
alias ti := test-integration

# ---------------------------------------------------------------------------- #
#                                    TYPE CHECK                                #
# ---------------------------------------------------------------------------- #

[group("checks")]
@type-check package="":
    {{ if package == "" { "just type-check-all" } else { "cd " + package + " && na tsgo --noEmit" } }}

# Run TypeScript check for all packages
[group("checks")]
@type-check-all:
    echo "🔍 Type checking effect-evm-v4..."
    cd evm && na tsgo --noEmit

    echo "✅ All type check passed"
