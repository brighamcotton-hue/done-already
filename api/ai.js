export default async function handler(req, res) {
  try {
    let body = "";

    await new Promise((resolve) => {
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", resolve);
    });

    const { grade, tone, input } = JSON.parse(body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a teen homework assistant.
Grade: ${grade}
Tone: ${tone}
Make the answer sound natural and human.`
          },
          {
            role: "user",
            content: input
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 IMPORTANT: show full response
    res.status(200).json({
      result: JSON.stringify(data, null, 2)
    });

  } catch (err) {
    res.status(500).json({
      result: "ERROR: " + err.message
    });
  }
}
