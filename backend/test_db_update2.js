const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.wcfusdcxqmpzhqyedlxn:Rachit123Giriraj@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  await client.connect();
  try {
    const { rows } = await client.query('SELECT * FROM ecos LIMIT 1');
    const eco = rows[0];
    const prodRes = await client.query('SELECT * FROM products WHERE id = $1', [eco.product_id]);
    const product = prodRes.rows[0];
    const currentRaw = String(product.version || '1.0').replace(/[vV]/g, '').trim();
    const currentVersion = parseFloat(currentRaw) || 1.0;
    const nextVersion = (currentVersion + 1).toFixed(1);

    console.log('Running UPDATE products...');
    await client.query('UPDATE products SET version = $1, updated_at = NOW() WHERE id = $2', [String(nextVersion), product.id]);
    
    console.log('Running UPDATE ecos...');
    await client.query('UPDATE ecos SET stage = $1, updated_at = NOW() WHERE id = $2', ['Done', eco.id]);
    
    console.log('Running INSERT approval_logs...');
    await client.query('INSERT INTO approval_logs (eco_id, user_name, action, comment, created_at) VALUES ($1, $2, $3, $4, NOW())', [eco.id, 'Test User', 'Moved to Done', '']);
    
    console.log('Success');
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    client.end();
  }
}
run();
