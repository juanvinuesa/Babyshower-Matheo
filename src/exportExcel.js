// Arma el Excel de /lista. exceljs pesa bastante, por eso se importa
// recién cuando alguien toca "Descargar Excel".

const HONEY  = 'FFF6C453';
const AMBER  = 'FFC96F1C';
const CREAM  = 'FFFFF7DF';
const STATE_FILL = {
  full:    'FFE3EFD6',
  partial: 'FFFDEBB5',
  empty:   'FFF3ECE4',
  open:    'FFF6ECC8',
};

function fill(argb) {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function styleHeader(row) {
  row.height = 22;
  row.eachCell(c => {
    c.font = { bold: true, color: { argb: 'FF2D2118' } };
    c.fill = fill(HONEY);
    c.alignment = { vertical: 'middle' };
    c.border = { bottom: { style: 'thin', color: { argb: AMBER } } };
  });
}

export async function downloadExcel({ rows, categories, summary, stateLabels }) {
  const { default: ExcelJS } = await import('exceljs');
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Baby Shower de Matheo';

  // ── Hoja 1: resumen ──
  const res = wb.addWorksheet('Resumen', { views: [{ showGridLines: false }] });
  res.columns = [{ width: 34 }, { width: 14 }, { width: 14 }, { width: 12 }];

  const title = res.addRow(['Regalos para Matheo']);
  title.font = { bold: true, size: 18, color: { argb: AMBER } };
  res.addRow([`Actualizado: ${new Date().toLocaleString('es-AR')}`]).font = { italic: true, color: { argb: 'FF6B5643' } };
  res.addRow([]);

  styleHeader(res.addRow(['Total', 'Cantidad']));
  for (const [label, value] of summary) {
    const r = res.addRow([label, value]);
    r.getCell(2).font = { bold: true };
    r.getCell(2).alignment = { horizontal: 'right' };
  }
  res.addRow([]);

  styleHeader(res.addRow(['Categoría', 'Elegidos', 'Cupo', 'Avance']));
  for (const c of categories) {
    const r = res.addRow([c.name, c.chosen, c.slots || 'Sin límite', c.slots ? c.chosen / c.slots : null]);
    r.getCell(3).alignment = { horizontal: 'right' };
    r.getCell(4).numFmt = '0%';
  }

  // ── Hoja 2: todos los regalos ──
  const ws = wb.addWorksheet('Regalos', { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = [
    { header: 'Categoría', key: 'cat',    width: 26 },
    { header: 'Regalo',    key: 'name',   width: 44 },
    { header: 'Detalle',   key: 'detail', width: 30 },
    { header: 'Elegido',   key: 'count',  width: 10 },
    { header: 'Cupo',      key: 'max',    width: 11 },
    { header: 'Faltan',    key: 'left',   width: 10 },
    { header: 'Estado',    key: 'state',  width: 14 },
  ];
  styleHeader(ws.getRow(1));

  const catName = Object.fromEntries(categories.map(c => [c.id, c.name]));
  for (const r of rows) {
    const row = ws.addRow({
      cat:    catName[r.category],
      name:   r.name,
      detail: r.detail ?? '',
      count:  r.count,
      max:    r.max ?? 'Sin límite',
      left:   r.max == null ? '' : Math.max(r.max - r.count, 0),
      state:  stateLabels[r.state],
    });
    row.getCell('max').alignment = { horizontal: 'right' };
    row.getCell('count').font = { bold: true };
    row.getCell('state').fill = fill(STATE_FILL[r.state]);
  }
  ws.autoFilter = { from: 'A1', to: 'G1' };

  // ── Hoja 3: lo que falta, para ir a comprar ──
  const miss = wb.addWorksheet('Faltan', { views: [{ state: 'frozen', ySplit: 1 }] });
  miss.columns = [
    { header: 'Regalo',  key: 'name',   width: 44 },
    { header: 'Detalle', key: 'detail', width: 30 },
    { header: 'Faltan',  key: 'left',   width: 10 },
  ];
  styleHeader(miss.getRow(1));
  for (const r of rows.filter(r => r.max != null && r.count < r.max)) {
    miss.addRow({ name: r.name, detail: r.detail ?? '', left: r.max - r.count });
  }
  miss.eachRow((row, i) => { if (i > 1 && i % 2 === 0) row.eachCell(c => { c.fill = fill(CREAM); }); });

  const buf  = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `regalos-matheo-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
