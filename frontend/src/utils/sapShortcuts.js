import { createSapFile } from './sapFile';

/**
 * Spesifik: ME2N - Purchasing Documents per Document Number
 * @param {string} po        - nomor PO
 * @param {string} sapUser   - dari auth/me -> sap_user
 * @param {string} sapServer - dari auth/me -> sap_server_con
 */
export function downloadME2N(po, sapUser, sapServer) {
  const content = [
    '[System]',
    'Name=P08',
    `Description=${sapServer}`,
    'Client=800',
    '[User]',
    `Name=${sapUser}`,
    'Language=EN',
    '[Function]',
    'Title=P08(1)800 Purchasing Documents per Document Number',
    `Command=/n*ME2N EN_EBELN-LOW=${po}; LISTU=ALV;`,
    'Type=SystemCommand',
    '[Configuration]',
    '[Options]',
    'Reuse=1',
  ].join('\n');

  const filename = `ME2N ${po}.sap`;
  createSapFile(filename, content);
}

/**
 * Spesifik: ME2N - Purchasing Documents per Document Number
 * @param {string} po        - nomor PO
 * @param {string} sapUser   - dari auth/me -> sap_user
 * @param {string} sapServer - dari auth/me -> sap_server_con
 */
export function downloadMIR7(po, sapUser, sapServer, sapCocd, sapVendorName, sapInvoiceDate, sapInvoiceAmount, sapBusArea) {
  const content = [
    '[System]',
    'Name=P08',
    `Description=${sapServer}`,
    'Client=800',
    '[User]',
    `Name=${sapUser}`,
    'Language=EN',
    '[Function]',
    `Title=${sapBusArea} P08(1)800 Purchasing Create Invoice`,
    `Command=/n*MIR7  BKPF-BUKRS=${sapCocd} ;INVFO-MWSKZ=i0; INVFO-BLDAT=${sapInvoiceDate};INVFO-SGTXT=${po}-${sapVendorName}, PT ;INVFO-WRBTR=${sapInvoiceAmount}; RM08M-EBELN=${po};INVFO-XMWST=;INVFO-XBLNR=;DYNP_OKCODE=HEADER_FI  
`,
    'Type=SystemCommand',
    '[Configuration]',
    '[Options]',
    'Reuse=1',
  ].join('\n');

  const filename = `${sapBusArea}  MIR7  ${po}.sap`;
  createSapFile(filename, content);
}


/**
 * Spesifik: ME2N - Purchasing Documents per Document Number
 * @param {string} doc number        - nomor doc number
 * @param {string} sapUser   - dari auth/me -> sap_user
 * @param {string} sapServer - dari auth/me -> sap_server_con
 */
export function downloadFBV0(doc, sapUser, sapServer) {
  const content = [
    '[System]',
    'Name=P08',
    `Description=${sapServer}`,
    'Client=800',
    '[User]',
    `Name=${sapUser}`,
    'Language=EN',
    '[Function]',
    'Title=P08(1)800 Purchasing Documents per Document Number',
    `Command=/n*ME2N EN_EBELN-LOW=${po}; LISTU=ALV;`,
    'Type=SystemCommand',
    '[Configuration]',
    '[Options]',
    'Reuse=1',
  ].join('\n');

  const filename = `FBV0 ${doc}.sap`;
  createSapFile(filename, content);
}