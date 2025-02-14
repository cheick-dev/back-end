import PDFDocument from 'pdfkit';
import { Storage } from 'node-appwrite';

// Fonction pour convertir un fichier en PDF dans l'environnement Appwrite
export const convertToPdf = async (fileId, mimeType, storage) => {
    // Créez un nouveau document PDF
    const doc = new PDFDocument();

    // Chemin de sortie pour le fichier PDF dans le stockage Appwrite
    const outputPath = `output/${fileId}.pdf`;

    // Créez un flux d'écriture vers le fichier PDF dans le stockage Appwrite
    const writeStream = storage.createWriteStream(fileId, outputPath);
    doc.pipe(writeStream);

    // Ajoutez du contenu au PDF (vous pouvez personnaliser cela)
    doc.fontSize(25).text(
        'Voici votre fichier converti en PDF dans Appwrite!',
        100,
        100
    );

    // Finalisez le document PDF
    doc.end();

    // Attendez que le fichier soit écrit dans le stockage Appwrite
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            resolve(outputPath);
        });
        writeStream.on('error', (err) => {
            reject(err);
        });
    });
};
