import {NextApiRequest, NextApiResponse} from 'next';
import {OpviousClient} from 'opvious';
import {Schema} from 'opvious/api';
import events from 'events';

/**
 * Opvious API client, authenticated automatically using the OPVIOUS_TOKEN
 * environment variable.
 */
const client = OpviousClient.create();

/** Standard Next.js API handler */
export default async function FixGridHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const grid = req.body.grid;
  if (!grid) {
    res.status(400).send({error: 'Missing input grid'});
    return;
  }

  const tracker = client.runSolve({
    problem: {
      formulation: {name: 'sudoku'},
      inputs: {parameters: [gridToTensor(grid)]},
      transformations: [{kind: 'relaxConstraint', label: 'outputMatchesInput'}],
    },
  });
  const [outcome, output] = await events.once(tracker, 'solved');

  res.status(200).json({
    grid: gridFromTensor(output.variables),
    mistakeCount: outcome.objectiveValue,
  });
}

// Parsing logic for a simple grid representation

type Grid = ReadonlyArray<string>;

function gridToTensor(grid: Grid): Schema<'Tensor'> {
  const entries: Schema<'TensorEntry'>[] = [];
  for (const [i, row] of grid.entries()) {
    for (const [j, c] of [...row].entries()) {
      const v = +c;
      if (!isNaN(v)) {
        entries.push({key: [i, j, v]});
      }
    }
  }
  return {label: 'input', entries};
}

function gridFromTensor(tensors: ReadonlyArray<Schema<'Tensor'>>): Grid {
  const tensor = tensors.find((t) => t.label === 'output')!;
  const rows = Array.from({length: 9}, () => Array.from({length: 9}));
  for (const entry of tensor.entries) {
    const [i, j, v] = entry.key;
    rows[+i][+j] = +v;
  }
  return rows.map((r) => r.join(''));
}
