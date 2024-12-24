export const block = (req,res,next) =>{
const isBlocked = true;
if (isBlocked) {
    res.status(403).json({ status:"error", message: "Forbidden" });
} else {
    next();
}
}