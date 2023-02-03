import { getDaysDoneIt, setDidIt } from '$lib/server';

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const daysDoneIt = getDaysDoneIt();
  return daysDoneIt;
}
