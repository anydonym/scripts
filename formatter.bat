@echo off
echo Formatting...
deno fmt --config ./deno.json
echo deno fmt ran.
echo Linting...
deno lint --config ./deno.json
echo deno lint ran.
echo Task done.
@echo on
