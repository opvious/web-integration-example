# Web integration example

This repository shows how to easily integrate optimization into a frontend
application via [Opvious](https://www.opvious.io).


## Folder structure

The code in this repository is divided into two folders:

+ [`/app`](/app), containing frontend application code. This example uses
  [Next.js](https://nextjs.org/) but many other frameworks would work equally
  well.
+ [`/specification`](/specification), containing the model's definition. Here we
  use the [Sudoku assistant
  model](https://www.opvious.io/notebooks/retro/notebooks/?path=examples/sudoku.ipynb)
  as illustration.

For most use-cases, we recommend using separate repositories for each of the
above folders when moving beyond the prototyping stage. If you already have an
existing frontend application, simply extend it correspondingly.


## Quickstart

1. Create an Opvious API token and store it as `OPVIOUS_TOKEN` environment
   variable

2. Build the model and register it

  ```sh
  cd specification
  poetry install --all-extras
  poetry run poe register
  ```

3. Run the frontend application

  ```sh
  cd app
  npm i
  npm run dev
  ```

That's it - open the link printed by the last command to start optimizing!
