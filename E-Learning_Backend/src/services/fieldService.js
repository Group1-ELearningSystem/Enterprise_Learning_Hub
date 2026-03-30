import { loadFields } from "../repository/fieldRepository.js";

export async function loadAllFiels() {
    return await loadFields();
}