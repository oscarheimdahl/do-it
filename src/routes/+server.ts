import { setDidIt } from '$/lib/server';
import { error, type RequestEvent } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST(event: RequestEvent<{}, string | null>) {
  const body = await event.request.json();
  const date = body.date as Date;
  const didit = body.didit as boolean;

  if (!date || didit === undefined) throw error(400, 'Missing props in body');

  const res = await setDidIt(date, didit);
  if (res.err) throw error(500, res.err);

  return new Response(String('res'));
}
