import http from "http";
import fs from "fs";

const PORT = 3000;
const FILE = "students.json";

const server = http.createServer((req, res) => {

    // -------------------------------
    // GET /
    // Display Student Form
    // -------------------------------
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Records</title>
            </head>

            <body>

                <h1>Student Record Management</h1>

                <form method="POST" action="/add">

                    <label>Student Name:</label>
                    <input type="text" name="name" required>

                    <br><br>

                    <label>Roll Number:</label>
                    <input type="text" name="roll" required>

                    <br><br>

                    <label>Course:</label>
                    <input type="text" name="course" required>

                    <br><br>

                    <label>Email:</label>
                    <input type="email" name="email" required>

                    <br><br>

                    <button type="submit">Add Student</button>

                </form>

                <br>

                <a href="/students">View Student Records</a>

            </body>
            </html>
        `);
    }


    // -------------------------------
    // POST /add
    // Receive and Store Student Data
    // -------------------------------
    else if (req.method === "POST" && req.url === "/add") {

        let body = "";

        // Receive form data
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        // When all data is received
        req.on("end", () => {

            // Convert form data into object
            const params = new URLSearchParams(body);

            const student = {
                name: params.get("name"),
                roll: params.get("roll"),
                course: params.get("course"),
                email: params.get("email")
            };

            // Read existing students
            fs.readFile(FILE, "utf8", (err, data) => {

                let students = [];

                // If file already exists and contains data
                if (!err && data.trim() !== "") {
                    try {
                        students = JSON.parse(data);
                    } catch (error) {
                        students = [];
                    }
                }

                // Add new student
                students.push(student);

                // Save updated data
                fs.writeFile(
                    FILE,
                    JSON.stringify(students, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500, {
                                "Content-Type": "text/html"
                            });

                            res.end(`
                                <h1>Error</h1>
                                <p>Unable to save student record.</p>
                            `);

                            return;
                        }

                        // Redirect to student records
                        res.writeHead(302, {
                            "Location": "/students"
                        });

                        res.end();
                    }
                );
            });
        });
    }

    // GET /students
    // Display Student Records
    else if (req.method === "GET" && req.url === "/students") {

        fs.readFile(FILE, "utf8", (err, data) => {

            let students = [];

            // If file exists
            if (!err && data.trim() !== "") {

                try {
                    students = JSON.parse(data);
                } catch (error) {
                    students = [];
                }
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            let records = "";

            if (students.length === 0) {

                records = `
                    <p>No student records found.</p>
                `;

            } else {

                records = `
                    <table border="1" cellpadding="10">

                        <tr>
                            <th>Student Name</th>
                            <th>Roll Number</th>
                            <th>Course</th>
                            <th>Email</th>
                        </tr>

                        ${students.map(student => `
                            <tr>
                                <td>${student.name}</td>
                                <td>${student.roll}</td>
                                <td>${student.course}</td>
                                <td>${student.email}</td>
                            </tr>
                        `).join("")}

                    </table>
                `;
            }

            res.end(`
                <!DOCTYPE html>
                <html>

                <head>
                    <title>Student Records</title>
                </head>

                <body>

                    <h1>Student Records</h1>

                    ${records}

                    <br>

                    <a href="/">Add Another Student</a>

                </body>

                </html>
            `);
        });
    }

    // Invalid Route
    
    else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>404 - Page Not Found</h1>
            <a href="/">Go to Home Page</a>
        `);
    }

});


 
// Start Server
 

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});