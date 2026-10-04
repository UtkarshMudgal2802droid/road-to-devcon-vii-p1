const http = require("http");

async function main() {
  console.log("Starting mock OpenAI server on port 3001...");
  const server = http.createServer((req, res) => {
    // Send headers immediately to clear the initial fetch await
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write('{\n  "choices": [');
    
    // Stall the rest of the body beyond the 15s timeout
    setTimeout(() => {
      res.end('\n    { "message": { "content": "Stalled answer" } }\n  ]\n}');
    }, 16000);
  });

  server.listen(3001, async () => {
    console.log("Mock server listening on port 3001.");
    console.log("Testing POST /api/ask with delayed body...");

    // Configure backend to use our mock server
    process.env.OPENAI_BASE_URL = "http://localhost:3001";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_RPC_URL = "https://rpc.sepolia.org"; // just for viem to not crash

    // We can't easily start Next.js programmatically in a short script without overhead.
    // Assuming the Next.js dev server is running on port 3000, we'll hit it.
    // If not running, we'll instruct the user on how to run it.
    try {
      const startTime = Date.now();
      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ensName: "dummy.eth", question: "Hello" })
      });
      const data = await res.json();
      const duration = Date.now() - startTime;
      
      console.log(`Response Status: ${res.status}`);
      console.log(`Duration: ${duration}ms`);
      if (res.status === 504) {
        console.log("SUCCESS: Request timed out correctly after ~15s!");
      } else {
        console.error("FAILURE: Request did not time out as expected. Data:", data);
      }
    } catch (err) {
      console.error("Error hitting Next.js backend. Make sure 'pnpm run dev' is running on port 3000.", err.message);
    }

    server.close();
    process.exit(0);
  });
}

main();
