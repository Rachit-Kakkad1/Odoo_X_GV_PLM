const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.wcfusdcxqmpzhqyedlxn:Rachit123Giriraj@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      SELECT pg_get_functiondef(pg_proc.oid) 
      FROM pg_proc 
      JOIN pg_trigger ON pg_trigger.tgfoid = pg_proc.oid 
      WHERE pg_trigger.tgrelid = 'products'::regclass
    `);
    console.log(res.rows[0].pg_get_functiondef);
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    client.end();
  }
}
run();
