export async function handleAPIRequest(token, msgs) {
  try {
    console.log("[handleAPIRequest] req", token, msgs);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Replace with your OpenAI API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: msgs,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0.1,
      }),
    });

    const data = await response.json();
    if (data !== null) {
      console.log("[handleAPIRequest] resp", data.choices[0]);
    } else {
      console.log("GPT didn't respond!");
    }
    return data.choices[0].message;
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

export function handleMessageRole(role) {
  if (role === "user") {
    return "user-message";
  } else if (role === "assistant") {
    return "assistant-message";
  } else if (role === "system") {
    return "system-message";
  } else {
    return "";
  }
}
