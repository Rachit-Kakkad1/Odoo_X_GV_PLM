const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.wcfusdcxqmpzhqyedlxn:Rachit123Giriraj@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      SELECT p.prosrc AS function_body
      FROM pg_trigger t
      JOIN pg_proc p ON t.tgfoid = p.oid
      JOIN pg_class c ON t.tgrelid = c.oid
      WHERE c.relname = 'products' AND t.tgisinternal = false
    `);
    require('fs').writeFileSync('trigger_body.txt', res.rows[0].function_body);
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    client.end();
  }
}
run();
