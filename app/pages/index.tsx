import Head from 'next/head';
import {ReactElement, useEffect, useState} from 'react';

import styles from '../styles/Home.module.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [solving, setSolving] = useState(false);
  const [output, setOutput] = useState('');
  const [mistakeCount, setMistakeCount] = useState(-1);

  const updateInput = (data: string) => {
    setInput(data)
    setMistakeCount(-1);
  };

  const randomizeInput = () => updateInput(randomGridInput());
  useEffect(randomizeInput, []);

  const solveGrid = () => {
    setMistakeCount(-1);
    setOutput('');
    setSolving(true);
    run()
      .catch((err) => void console.error(err))
      .finally(() => void setSolving(false));

    async function run() {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({grid: parseGridInput(input)}),
      });
      if (res.status !== 200) {
        const err: any = new Error('Unexpected response');
        err.response = res;
        throw err;
      }
      const data = await res.json();
      setOutput(data.grid.join(''));
      setMistakeCount(data.mistakeCount);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sudoku Assistant</title>
      </Head>

      <main>
        <h1 className={styles.title}>
          Sudoku Assistant
        </h1>

        <p className={styles.description}>
          A sample application which uses mixed-integer programming to fix
          mistakes in Sudoku grids.
        </p>

        <form className={styles.grids}>
          <Grid editable id={'input-grid'} data={input} onData={updateInput} />
          <div className={styles.gridActions}>
            <button disabled={solving} onClick={(e) => { solveGrid(); e.preventDefault(); }}>
              {solving ? 'Finding solution...' : 'Find closest solution'}
            </button>
            <button onClick={(e) => { randomizeInput(); e.preventDefault(); }}>
              Randomize grid
            </button>
            {mistakeCount >= 0
              ? (<p>The input grid has {mistakeCount} mistakes.</p>)
              : (<p>The input grid may have mistakes.</p>)}
          </div >
          <Grid id={'output-grid'} data={output} />
        </form>
      </main>

      <footer>
        Optimization powered by&nbsp;
        <a href="https://www.opvious.io" target="_blank">Opvious</a>.
        Check out the&nbsp;
        <a
          href="https://github.com/opvious/web-integration-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          source code
        </a>&nbsp;
        to see how easy it is to integrate optimization in your own application!
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

function Grid(p: {
  readonly id: string;
  readonly editable?: boolean;
  readonly data?: string;
  readonly onData?: (data: string) => void;
}): ReactElement {
  return (
    <textarea
      id={p.id}
      className={styles.grid}
      readOnly={!p.editable}
      rows={9}
      cols={15}
      value={p.data ?? ''}
      onChange={(e) => { p.onData?.(e.target.value); e.preventDefault(); }}
    ></textarea>
  );
}

function randomGridInput(): string {
  const nums = Array.from({length: 81}, () => {
    const val = (32 * Math.random() | 0) + 1;
    return val < 10 ? val : '.';
  });
  return nums.join('');
}

function parseGridInput(s: string): ReadonlyArray<string> {
  const rows: string[] = [];
  let row: string[] = [];
  for (const c of s) {
    if (c === '\n' || row.length === 9) {
      rows.push(row.join(''));
      row = [];
      if (rows.length === 9) {
        break;
      }
    }
    if (c !== '\n') {
      row.push(c);
    }
  }
  if (row.length) {
    rows.push(row.join(''));
  }
  return rows;
}
