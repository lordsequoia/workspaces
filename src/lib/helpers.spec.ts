import test from 'ava';

import { createRandomName } from './helpers';

test('generate a random workspace name', (t) => {
  t.is(typeof createRandomName(), 'string');
});
