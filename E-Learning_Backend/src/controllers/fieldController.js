import { loadAllFiels } from "../services/fieldService.js";

export async function loadAllFieldController(req, res) {
    try {
        const data = await loadAllFiels();
        res.status(200).json(data);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to fetch fields" })
    }
}