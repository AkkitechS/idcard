import { app } from "./app.js";
import { connectDB } from "./db/db_connection.js";

connectDB()
.then(() => {

    app.on("error", (err) => {
        console.log("ERROR ", err);
        throw err
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch(err => {
    console.log("MONGODB CONNECTION FAILED !!!", err);
});