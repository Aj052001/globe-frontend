// pages/api/sheet.js

import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
    const doc = new GoogleSpreadsheet('1jL5uergZkcgMc9C_4P_TsuxpfKNgHmBtGLZNlv0p7R8');

    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_CLIENT_EMAIL, // Ensure you have this in your .env.local
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure your private key is correctly formatted in .env.local
        });

        await doc.loadInfo(); // Loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // Or use doc.sheetsById or doc.sheetsByTitle
        const rows = await sheet.getRows();
        const data = rows.map(row => ({
            resident: row.Resident,
            house: row.House,
            grant: parseInt(row.Grant, 10)  // Parsing Grant as integer
        }));

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
}
