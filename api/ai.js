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
        model: "gpt-5",
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

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response from AI"
    });

  } catch (err) {
    res.status(500).json({
      result: "Error: " + err.message
    });
  }
}
