// server.ts
import app from './app.ts';
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server running on port ${PORT} 🚀`);
    console.log(`URL: ${url}`);
});
