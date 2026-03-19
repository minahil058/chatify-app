import app from "../backend/server.js";
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`✅ api/index.js listening on port ${PORT}`));
}

export default app;

