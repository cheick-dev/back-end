import puppeteer from 'puppeteer'; // Pour générer des fichiers PDF

// Fonction pour convertir HTML en PDF avec Puppeteer
export const convertHtmlToPdf = async (htmlContent) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();
    await browser.close();
    return pdfBuffer;
};

// Fonction pour convertir les données Excel en HTML
export const convertExcelToHtml = (sheetData) => {
    let htmlContent = "<table border='1'>";
    // Générer l'en-tête du tableau
    const headers = Object.keys(sheetData[0]);
    htmlContent +=
        '<tr>' +
        headers.map((header) => `<th>${header}</th>`).join('') +
        '</tr>';

    // Remplir les lignes de données
    sheetData.forEach((row) => {
        htmlContent +=
            '<tr>' +
            headers.map((header) => `<td>${row[header]}</td>`).join('') +
            '</tr>';
    });
    htmlContent += '</table>';
    return htmlContent;
};
