import { getAllRequests, getRequestById, updateRequests } from "../repository/requestRepository.js";

export async function fetchAllRequests(search, status, date) {
    return await getAllRequests(search, status, date)
}

export async function fetchRequestById(id) {
    return await getRequestById(id);
}

export async function updateRequestsService(id, status) {
    return await updateRequests(id, status)
}