export default async (req) => {
  const respuesta = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: await req.text(),
  });

  return new Response(await respuesta.text(), {
    status: respuesta.status,
    headers: { "Content-Type": "application/json" },
  });
};