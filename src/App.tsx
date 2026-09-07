/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Landing } from './components/Landing';
import { Workspace } from './components/Workspace';

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered ? (
        <Landing onEnter={() => setEntered(true)} />
      ) : (
        <Workspace />
      )}
    </>
  );
}
