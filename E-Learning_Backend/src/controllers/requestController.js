import { fetchAllRequests, fetchRequestById, updateRequestsService } from "../services/requestService.js";

export async function getAllRequestsController(req, res) {
    try{
        const {search, status, date} = req.query;
        const requests =  await fetchAllRequests(search, status, date)
        res.status(200).json(requests)
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to search requests"});
    }
}

export async function getRequestByIdController(req, res) {
    try {
        const { id } = req.params;
        const request = await fetchRequestById(id);
        res.status(200).json(request)
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to fetch requests"});
    }
}

export async function updateRequestController(req, res) {
    try{
        const id = req.params.id
        const status = req.body.status
        await updateRequestsService(id, status)
        res.json({message: "Update Succesfully"})
    }catch(err){    
        console.error(err);
        res.status(500).json({message: "Failed to update requests"});
    }
}