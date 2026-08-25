import http from "http";

const PORT = 3000;

const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "text/html");

    if (req.url === "/" || req.url === "/home") {
        res.statusCode = 200;

        res.end(`
            <html>
                <head>
                    <title>My College</title>
                </head>
                <body>
                    <h1>Welcome to My College</h1>
                    <p>This is the home page of my college website.</p>

                    <a href="/">Home</a> |
                    <a href="/about">About</a>
                </body>
            </html>
        `);
    }

    else if (req.url === "/about") {
        res.statusCode = 200;

        res.end(`
            <html>
                <head>
                    <title>About Department</title>
                </head>
                <body>
                    <h1>About Computer Science Department</h1>
                    <p>Welcome to the Computer Science Department.</p>

                    <a href="/">Home</a> |
                    <a href="/about">About</a>
                </body>
            </html>
        `);
    }

    else {
        res.statusCode = 404;

        res.end(`
            <html>
                <head>
                    <title>404 - Not Found</title>
                </head>
                <body>
                    <h1>404 - Page Not Found</h1>
                    <p>The requested page does not exist.</p>

                    <a href="/">Go to Home</a>
                </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});