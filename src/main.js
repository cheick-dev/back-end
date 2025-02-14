import { Client, Storage } from 'node-appwrite';
import { convertToPdf } from './convertToPdf'; // Supposons que cette fonctionnalité soit implémentée dans un fichier séparé

// Cette fonction Appwrite sera exécutée chaque fois que votre fonction est déclenchée
export default async ({ req, res, log, error }) => {
    // Vous pouvez utiliser le SDK Appwrite pour interagir avec d'autres services
    // Pour cet exemple, nous utilisons le service de stockage
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(req.headers['x-appwrite-key'] ?? '');
    const storage = new Storage(client);

    try {
        // Supposons que nous ayons une fonction pour lister les fichiers du stockage
        const files = await storage.listFiles();
        for (const file of files) {
            // Vérifiez si le fichier est déjà au format PDF
            if (file.mimeType !== 'application/pdf') {
                // Convertissez le fichier au format PDF
                await convertToPdf(file.id, file.mimeType);
                log(`Le fichier ${file.name} a été converti au format PDF`);
            }
        }
    } catch (err) {
        error(
            'Impossible de convertir les fichiers au format PDF: ' + err.message
        );
    }

    return res.json({
        message: 'Impossible de convertir les fichiers au format PDFF',
    });
};
