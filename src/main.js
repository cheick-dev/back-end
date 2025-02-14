import { Client, Storage } from 'node-appwrite';
import mammoth from 'mammoth';
import xlsx from 'xlsx';
import path from 'path';
import { convertHtmlToPdf } from './convertToPdf';

// Fonction déclenchée par Appwrite (via webhook ou trigger)
export default async ({ req, res, log, error }) => {
    // Initialisation du client Appwrite
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT) // Endpoint Appwrite
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID) // ID du projet
        .setKey(req.headers['x-appwrite-key'] ?? ''); // Clé d'API Appwrite

    const storage = new Storage(client);

    try {
        // Récupération des informations sur le fichier uploadé
        const fileId = req.body.$id; // ID du fichier téléchargé
        const fileName = req.body.name;
        const fileExtension = path.extname(fileName).toLowerCase();

        log(`Traitement du fichier : ${fileName}`);

        // Récupérer le fichier depuis le storage Appwrite
        const fileData = await storage.getFilePreview(fileId);

        let pdfBuffer;

        // Conversion selon le type de fichier
        if (fileExtension === '.pdf') {
            pdfBuffer = fileData.buffer;
            log(
                `Le fichier ${fileName} est déjà un PDF, aucune conversion nécessaire.`
            );
        } else if (fileExtension === '.docx') {
            const result = await mammoth.convertExcelToHtml({
                buffer: fileData.buffer,
            });
            const htmlContent = result.value;
            pdfBuffer = await convertHtmlToPdf(htmlContent);
            log(`Fichier Word converti en PDF pour ${fileName}`);
        } else if (fileExtension === '.xlsx') {
            const workbook = xlsx.read(fileData.buffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const sheetData = xlsx.utils.sheet_to_json(sheet);
            const htmlContent = convertExcelToHtml(sheetData);
            pdfBuffer = await convertHtmlToPdf(htmlContent);
            log(`Fichier Excel converti en PDF pour ${fileName}`);
        } else {
            log(`Format de fichier non pris en charge : ${fileExtension}`);
            return res.json({
                message: `Le format de fichier ${fileExtension} n'est pas pris en charge.`,
            });
        }

        // Télécharger le PDF converti dans le même bucket sans modifier l'ID
        await storage.createFile(
            '67a77cd8000fe5cee78c',
            pdfBuffer,
            fileName.replace(fileExtension, '.pdf')
        );
        log(`Fichier PDF téléchargé avec succès : ${fileName}`);

        // Retourner une réponse
        return res.json({
            message: 'Conversion terminée et fichier téléchargé.',
        });
    } catch (err) {
        error(`Erreur lors de la conversion des fichiers : ${err.message}`);
    }

    return res.json({ data: 'ok' });
};

// import { Client, Storage, InputFile } from 'node-appwrite';

// module.exports = async (context) => {
//   try {
//     const client = new Client()
//       .setEndpoint(context.env.APPWRITE_ENDPOINT)
//       .setProject(context.env.APPWRITE_PROJECT_ID)
//       .setKey(context.env.APPWRITE_API_KEY);

//     const storage = new Storage(client);
//     const data = JSON.parse(context.req.body);

//     let result;

//     switch (data.action) {
//       case 'list':
//         result = await storage.listFiles(data.bucketId);
//         break;

//       case 'create':
//         const file = InputFile.fromBuffer(
//           Buffer.from(data.fileContent),
//           data.fileName
//         );
//         result = await storage.createFile(
//           data.bucketId,
//           file,
//           data.permissions
//         );
//         break;

//       case 'delete':
//         result = await storage.deleteFile(data.bucketId, data.fileId);
//         break;

//       case 'getFile':
//         result = await storage.getFile(data.bucketId, data.fileId);
//         break;

//       default:
//         throw new Error('Action non valide');
//     }

//     return context.res.json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     return context.res.json({
//       success: false,
//       error: error.message
//     });
//   }
// };
