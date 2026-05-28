/**
 * Generic: download file dengan extension .sap
 * @param {string} filename - nama file, misal "ME2N 4500001234.sap"
 * @param {string} content  - isi file dalam format SAP shortcut
 */
export function createSapFile(filename, content) {
  const blob = new Blob([content], { type: 'application/x-sapshortcut' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
