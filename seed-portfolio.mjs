import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Data from curadoria ──────────────────────────────────────────────────────
const data = [
  {
    categorySlug: 'gestante',
    categoryId: 2,
    title: 'Ensaio Gestante',
    slug: 'ensaio-gestante-curadoria',
    description: 'Ensaio gestante com luz natural suave, atmosfera etérea e conexão íntima com a maternidade',
    cover: 'https://drive.google.com/uc?export=view&id=1AijtKMekO-CBMrL5lEx3l96XkyxFVaBQ',
    photos: [
      'https://drive.google.com/uc?export=view&id=1AijtKMekO-CBMrL5lEx3l96XkyxFVaBQ',
      'https://drive.google.com/uc?export=view&id=1sMblVYCun32mVr7JXHEMgB5TSypdHrAg',
      'https://drive.google.com/uc?export=view&id=1jSmDi5y9al3RnHpTovfa8ELquHPk6ZWV',
      'https://drive.google.com/uc?export=view&id=1z6UjtJEsC75VR_2s4SjEf40c6NiGiqaS',
      'https://drive.google.com/uc?export=view&id=1piUbTynZPnBkhGfBIOv4lQzN7z4AS1Lg',
      'https://drive.google.com/uc?export=view&id=17c4aBI_-MoVD1iGOU9U5l6oGUOhWsxUH',
      'https://drive.google.com/uc?export=view&id=13RVKixCZMgGzVACk2QRk0OuH-DS4xdgn',
      'https://drive.google.com/uc?export=view&id=1xn14j75jVylmTfgHVdDWlg5Oaxl3NRtL',
      'https://drive.google.com/uc?export=view&id=1CUANMBNZwIjNB1fJq3p_7ME5f28md1-l',
      'https://drive.google.com/uc?export=view&id=1W7JPAYvCZXo4GY2yANmswJkWcgWlnMzG',
      'https://drive.google.com/uc?export=view&id=1P8XLuQciE3VjsvRmgYLzt4aoCpU7LVrF',
      'https://drive.google.com/uc?export=view&id=18I7Jd0Yavq2-sVB5VMpyhvozD9JTGgRG',
      'https://drive.google.com/uc?export=view&id=1eoH4-EHbRiaCPi-8VGuvD2SM3wGqnbNy',
      'https://drive.google.com/uc?export=view&id=1Iwb3EptE7nMUOrD3zOtA-cWy0lmML5s6',
      'https://drive.google.com/uc?export=view&id=18wrCbztuMEL-HR7yUyEa0BOBOAnBj9XX',
    ],
  },
  {
    categorySlug: 'ensaios-femininos',
    categoryId: 1,
    title: 'Ensaio Feminino',
    slug: 'ensaio-feminino-curadoria',
    description: 'Ensaio feminino fine art com luz natural, paleta terrosa e expressão autêntica da feminilidade',
    cover: 'https://drive.google.com/uc?export=view&id=1r_DJSPXPLe4ZpQOxdYzXh9VNfsqP8Xt8',
    photos: [
      'https://drive.google.com/uc?export=view&id=1r_DJSPXPLe4ZpQOxdYzXh9VNfsqP8Xt8',
      'https://drive.google.com/uc?export=view&id=1v4oETacx8J7p5TUhjwx15WuPbLXSxfhx',
      'https://drive.google.com/uc?export=view&id=1oCq-md1Ha7w33DEbG9W2HVNC8Pk2gFga',
      'https://drive.google.com/uc?export=view&id=1KhrJ2tsNor5bE5jAHf8oFaruQQ-eXP44',
      'https://drive.google.com/uc?export=view&id=16T2Ektn2Kb4-5J3DGeGfcrsUsEaI7r0f',
      'https://drive.google.com/uc?export=view&id=18volj5r0TiZJmvrjew1yq8_ZEbegDMb4',
      'https://drive.google.com/uc?export=view&id=1FZbleC4q_WVgAE0uLqDpbRTelQO2Sp2d',
      'https://drive.google.com/uc?export=view&id=141mtAI4Za_07MTLTX1_5wB0ofkBTiMGY',
      'https://drive.google.com/uc?export=view&id=1nxGj7nAM_dcFtU-KM8uMxfWwotl4-B90',
      'https://drive.google.com/uc?export=view&id=1gr-s1umQlH-O6c5DfyhOZWbJOpgn2fYX',
      'https://drive.google.com/uc?export=view&id=1M3hJXUuq_Spp98JtMz5fkVHwu3DOGG2z',
      'https://drive.google.com/uc?export=view&id=18weE5s3F3mIbnoZIZWWegaRzGrA-jE0i',
      'https://drive.google.com/uc?export=view&id=1H7RUvMt1zAcV_sy3vVcrvCSpS8GiDMoo',
      'https://drive.google.com/uc?export=view&id=1yb7k7fNhuh7MvBEouWnUSVlor7aFY9U6',
      'https://drive.google.com/uc?export=view&id=1yt76JKtJoefR_karsdEjEwPIDYlIsXVc',
    ],
  },
  {
    categorySlug: 'familia',
    categoryId: null, // new category
    title: 'Ensaio de Família',
    slug: 'ensaio-familia-curadoria',
    description: 'Ensaio familiar com momentos genuínos, conexão emocional e luz natural acolhedora',
    cover: 'https://drive.google.com/uc?export=view&id=1SUM8iEsCwP6Juea0zLITqWl_XrPumpzB',
    photos: [
      'https://drive.google.com/uc?export=view&id=1SUM8iEsCwP6Juea0zLITqWl_XrPumpzB',
      'https://drive.google.com/uc?export=view&id=1wiOJ9bz3iqcG59IqUK0SV1BNqGL49FkR',
      'https://drive.google.com/uc?export=view&id=1w46KUdhUyPBxKUzlcDxqsBPTt6FNgg7S',
      'https://drive.google.com/uc?export=view&id=1FK8NwWxtxGLdOmZpDAH_TcT9H76vJ0rQ',
      'https://drive.google.com/uc?export=view&id=1GYtjHjL177Zvp1M5IWVVPOzZ0oBeg_yk',
      'https://drive.google.com/uc?export=view&id=18C4yx8ODRHn2QyWElEXnTTfBhyVt3XPh',
      'https://drive.google.com/uc?export=view&id=1zTXPw5K7ij4bHp1w6vtMvtRs75wAW-18',
      'https://drive.google.com/uc?export=view&id=1oElJdB5nBKaq3lNEdh6lzRq0FBQnJ_fX',
      'https://drive.google.com/uc?export=view&id=1m19YIWnjJPcx44w13DCz9djaF4TOz8_p',
      'https://drive.google.com/uc?export=view&id=1iRjbMDXu4iztUSOtJyBt2O4U-YE_eQDy',
      'https://drive.google.com/uc?export=view&id=19g1SfEm2-A3y64uiMUVlyiqFkISCWi71',
      'https://drive.google.com/uc?export=view&id=1Wtk3vB77S2WTc6hta_uFwFLCG8NRczDZ',
      'https://drive.google.com/uc?export=view&id=1IaW2P7glJpZsJC6uTIHel4OtDGxGJl8a',
      'https://drive.google.com/uc?export=view&id=1Zpq58euF9o18Wnh0dMOjp_5k1CjgcT7g',
      'https://drive.google.com/uc?export=view&id=1F_fRObLSeeioz5OXLeUD8uM0eFYMw-fF',
    ],
  },
  {
    categorySlug: 'casamentos',
    categoryId: null, // new category
    title: 'Casamento',
    slug: 'casamento-curadoria',
    description: 'Registro de casamento com fotografia artística, emoções autênticas e momentos eternizados com delicadeza',
    cover: 'https://drive.google.com/uc?export=view&id=17p-wtdy-CiNTfP3f_xN6_dudIxLhUh73',
    photos: [
      'https://drive.google.com/uc?export=view&id=17p-wtdy-CiNTfP3f_xN6_dudIxLhUh73',
      'https://drive.google.com/uc?export=view&id=1gnUqiHtmld3eVyGaOxTEdxQpoKA9Zu1x',
      'https://drive.google.com/uc?export=view&id=1Mu9Kb-52nrkU9FgCvlpWXmKW_IYmP9gE',
      'https://drive.google.com/uc?export=view&id=1SETdH8GOL-msB-joYoSE8VR-_Ulozk-3',
      'https://drive.google.com/uc?export=view&id=1j--cCxjFhNaelEk_Ce3PTGSqisToKDBN',
      'https://drive.google.com/uc?export=view&id=1OQkKaHYnEqTGk-ZlYuzWjBtepqn8mvVR',
      'https://drive.google.com/uc?export=view&id=1Wp26A5bvFLM5dSG39BLw7waVwH-_wWKg',
      'https://drive.google.com/uc?export=view&id=1ewtfuxDWTeWIOsissDVfxO9ZBp17Eb2J',
      'https://drive.google.com/uc?export=view&id=1Q-XWFSXbae5cwNzQJaSYTp4oWnG0C3W0',
      'https://drive.google.com/uc?export=view&id=16kWDerxLT8XAo61JN03GfrlRra02sZVR',
      'https://drive.google.com/uc?export=view&id=1RkvPbOHuMR9JanEHpFzUUIg4MSdHS3ZE',
      'https://drive.google.com/uc?export=view&id=1efwGt-Irfx29pZ3zcFzOK6Qr0-tT-GkC',
      'https://drive.google.com/uc?export=view&id=1ZK4oO1hZjEKCwMnbMZVPnqf78eUDdb0b',
      'https://drive.google.com/uc?export=view&id=1xJx63jiTAXT6hxucs1zE8kU1-LNrcSRb',
      'https://drive.google.com/uc?export=view&id=15QVRwH94XIK_SY9lWkwWuXbxZsUxdB_G',
    ],
  },
  {
    categorySlug: 'profissional',
    categoryId: 3,
    title: 'Ensaio Profissional',
    slug: 'ensaio-profissional-curadoria',
    description: 'Ensaio corporativo e profissional com personalidade autêntica, luz natural e composição elegante',
    cover: 'https://drive.google.com/uc?export=view&id=1eJu501dRUcDVUHGN1v4lpWoPPdAIlfUD',
    photos: [
      'https://drive.google.com/uc?export=view&id=1eJu501dRUcDVUHGN1v4lpWoPPdAIlfUD',
      'https://drive.google.com/uc?export=view&id=1Rg_nEmzrznGvj7NRmCK9CT9mKzpMUTm-',
      'https://drive.google.com/uc?export=view&id=1D7Fd55zFbjUxmSovZtwB9g9tBrtsZTwZ',
      'https://drive.google.com/uc?export=view&id=1A6KKooJyWR3BujexIiFRpX6aApjG7qnR',
      'https://drive.google.com/uc?export=view&id=1T71PJs5mDeyL6yx09qa89sChd77YnIty',
      'https://drive.google.com/uc?export=view&id=19cOuAslIJnO39AlvbapSVoOjZAt0BqQ0',
      'https://drive.google.com/uc?export=view&id=1sQkZLQxfXq-xyekYTLNZrNZg-VkB6Uvy',
      'https://drive.google.com/uc?export=view&id=1ErCS4A3d6s4YrEJzPxQUGEeB2m01zpIQ',
      'https://drive.google.com/uc?export=view&id=1Clgxek74F1uuu3BrteEhhjJv9TOilN1u',
      'https://drive.google.com/uc?export=view&id=1SYv3Zrh9Zh9kTTZksGtjKVE6BxQ3aS27',
      'https://drive.google.com/uc?export=view&id=1P43L-qM4Hw1AVekrsrpMs13hQuGi23hR',
      'https://drive.google.com/uc?export=view&id=1D4Nwhs1fY-dt9t3clB7NHcFKqhuKlL05',
      'https://drive.google.com/uc?export=view&id=1dUUcSEtV6C1-ILzsEjQ34fA_QThoLrl3',
      'https://drive.google.com/uc?export=view&id=1eCHWYrSgqq8toa1j8vNsjOkc6ImjmrII',
      'https://drive.google.com/uc?export=view&id=1d9NxNfTqRLQiJ-v4EzyayIP9haoZNJR6',
    ],
  },
  {
    categorySlug: 'editoriais',
    categoryId: null, // new category
    title: 'Editorial Artístico',
    slug: 'editorial-artistico-curadoria',
    description: 'Fotografia editorial e obras de arte com expressão poética, composição única e identidade visual marcante',
    cover: 'https://drive.google.com/uc?export=view&id=1c1140g525imjqWRyDIjXmj5OPqheLpU9',
    photos: [
      'https://drive.google.com/uc?export=view&id=1c1140g525imjqWRyDIjXmj5OPqheLpU9',
      'https://drive.google.com/uc?export=view&id=1I3SgRuFBF-MYXXzeomblE3qUsb-oNkTu',
      'https://drive.google.com/uc?export=view&id=1XkhllytZmYLPpEa7gbeK5TLkgiqyB-pO',
      'https://drive.google.com/uc?export=view&id=1i07JJYGeYvqotX5SH_uApd9dvaZ_9nRY',
      'https://drive.google.com/uc?export=view&id=11IwJSWuaRLOiw8QBHsB5RUKA0R8rVczP',
      'https://drive.google.com/uc?export=view&id=1Y8wMmvr2K338GvACynKX7wdPwvhsEmkP',
      'https://drive.google.com/uc?export=view&id=1I2a58GqbEZl44Y8ZAlo6nD4-JT8tygKt',
      'https://drive.google.com/uc?export=view&id=1UCp7g-CnXaJj4icYPuhK9coAO-LLzLHu',
      'https://drive.google.com/uc?export=view&id=1wo_RI76QDHflaZitmz5CRyrRnOGujnP5',
      'https://drive.google.com/uc?export=view&id=1XlFpBdIEUEcdXigmrVPVDLRD7Ap7OsKX',
      'https://drive.google.com/uc?export=view&id=1B-U0PwmFGJD3GV1UTeSAoj5gy73s4K4g',
      'https://drive.google.com/uc?export=view&id=1oS_H0tNo171IwZ_VtkQlmul8MVmu6w6d',
      'https://drive.google.com/uc?export=view&id=1RTYcn4mLNzNtYHhBZfDH_JarPEFjle-E',
      'https://drive.google.com/uc?export=view&id=1PoK1xHJJjvxxFqkIzCCpPaA_yRm1lulh',
      'https://drive.google.com/uc?export=view&id=1YHhdCAECMuMSF2zbFa-VPdb9waU7uliB',
    ],
  },
];

// ─── Insert new categories (Família, Casamentos, Editoriais) ──────────────────
const newCategories = [
  { slug: 'familia', name: 'Família', description: 'Ensaios familiares com momentos genuínos e luz natural acolhedora', order: 7 },
  { slug: 'casamentos', name: 'Casamentos', description: 'Registro artístico de casamentos com emoções autênticas', order: 8 },
  { slug: 'editoriais', name: 'Editoriais', description: 'Fotografia editorial com expressão poética e identidade visual marcante', order: 9 },
];

for (const cat of newCategories) {
  const [existing] = await conn.execute('SELECT id FROM portfolio_categories WHERE slug = ?', [cat.slug]);
  if (existing.length === 0) {
    await conn.execute(
      'INSERT INTO portfolio_categories (slug, name, description, type, `order`, isActive) VALUES (?, ?, ?, "ensaio", ?, 1)',
      [cat.slug, cat.name, cat.description, cat.order]
    );
    console.log(`Created category: ${cat.name}`);
  } else {
    console.log(`Category already exists: ${cat.name} (id=${existing[0].id})`);
  }
}

// ─── Get updated category map ─────────────────────────────────────────────────
const [catRows] = await conn.execute('SELECT id, slug FROM portfolio_categories');
const catMap = {};
for (const row of catRows) catMap[row.slug] = row.id;
console.log('Category map:', catMap);

// ─── Insert shoots and photos ─────────────────────────────────────────────────
for (const item of data) {
  const catId = item.categoryId ?? catMap[item.categorySlug];
  if (!catId) { console.error(`No category found for slug: ${item.categorySlug}`); continue; }

  // Update category cover image
  await conn.execute(
    'UPDATE portfolio_categories SET coverImageUrl = ? WHERE id = ?',
    [item.cover, catId]
  );

  // Check if shoot already exists
  const [existing] = await conn.execute('SELECT id FROM portfolio_shoots WHERE slug = ?', [item.slug]);
  let shootId;
  if (existing.length > 0) {
    shootId = existing[0].id;
    await conn.execute(
      'UPDATE portfolio_shoots SET title=?, description=?, coverImageUrl=?, isActive=1, isFeatured=1 WHERE id=?',
      [item.title, item.description, item.cover, shootId]
    );
    console.log(`Updated shoot: ${item.title} (id=${shootId})`);
    // Delete existing images for this shoot to re-insert fresh
    await conn.execute('DELETE FROM portfolio_images WHERE shootId = ?', [shootId]);
  } else {
    const [result] = await conn.execute(
      'INSERT INTO portfolio_shoots (categoryId, title, slug, description, coverImageUrl, isActive, isFeatured, `order`) VALUES (?, ?, ?, ?, ?, 1, 1, 1)',
      [catId, item.title, item.slug, item.description, item.cover]
    );
    shootId = result.insertId;
    console.log(`Created shoot: ${item.title} (id=${shootId})`);
  }

  // Insert photos
  for (let i = 0; i < item.photos.length; i++) {
    await conn.execute(
      'INSERT INTO portfolio_images (shootId, imageUrl, `order`, isActive) VALUES (?, ?, ?, 1)',
      [shootId, item.photos[i], i + 1]
    );
  }
  console.log(`  → Inserted ${item.photos.length} photos for "${item.title}"`);
}

await conn.end();
console.log('\n✅ Portfolio seeding complete!');
