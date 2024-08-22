import { NextResponse } from 'next/server';

export let cache = {
  data: null,
  lastFetched: null
};

const CACHE_DURATION = 60 * 60 * 1000; // 60分鐘，以毫秒為單位

export async function GET(request) {
  const currentTime = Date.now();

  // 檢查快取是否有效
  if (cache.data && cache.lastFetched && (currentTime - cache.lastFetched < CACHE_DURATION)) {
    console.log("--- cache data direct return ---");
    return NextResponse.json(cache.data);
  }

  console.log("--- cache data not found, fetch new data ---");
  // 如果快取無效或不存在，則從 Google Sheets 獲取新數據
  try {
    const sheetId = process.env.SHEET_ID;
    const sheets = [
      { name: 'person', key: 'people' },
      { name: 'skill', key: 'skills' }
    ];

    const results = {};

    for (const sheet of sheets) {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheet.name}`;
      const response = await fetch(url);
      const csvData = await response.text();
      
      const rows = csvData.split('\n');
      const headers = rows[0].split(',').map(header => header.replace(/"/g, '').trim());
      
      results[sheet.key] = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.replace(/"/g, '').trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });
    }

    // 更新快取
    cache = {
      data: results,
      lastFetched: currentTime
    };

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}