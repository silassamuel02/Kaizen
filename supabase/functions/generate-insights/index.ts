import OpenAI from "openai";

declare const Deno: any;

const corsHeaders = {

  "Access-Control-Allow-Origin": "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

};

const openai = new OpenAI({

  apiKey:
    Deno.env.get(
      "OPENAI_API_KEY"
    ),

});

Deno.serve(async (req: Request) => {

  /* CORS */

  if (req.method === "OPTIONS") {

    return new Response("ok", {

      headers: corsHeaders,

    });
  }

  try {

    const body =
      await req.json();

    const {

      notes,
      activities,
      members,

    } = body;

    const prompt = `

You are an advanced
workspace intelligence AI.

Analyze the workspace data
and generate exactly 3
HIGHLY SPECIFIC operational
insights.

Rules:

- Be practical.
- Be realistic.
- Mention actual patterns.
- Detect inactivity.
- Detect productivity trends.
- Detect collaboration gaps.
- Detect operational risks.
- Avoid generic AI language.
- Avoid futuristic corporate buzzwords.
- Never say:
  "cognitive intelligence",
  "adaptive systems",
  "neural infrastructure",
  "behavioral synergy",
  "quantum operations".

The insights should sound
like a smart operations lead.

NOTES:
${JSON.stringify(notes)}

ACTIVITIES:
${JSON.stringify(activities)}

MEMBERS:
${JSON.stringify(members)}

Return ONLY valid JSON.

Format:

[
  {
    "type": "Risk",
    "title": "Low Collaboration Activity",
    "description": "Only one member contributed recent updates in this workspace."
  }
]

`;

    const response =

      await openai.chat.completions.create({

        model:
          "gpt-4.1-mini",

        messages: [

          {

            role: "system",

            content:
              "You are a workspace operations intelligence engine.",

          },

          {

            role: "user",

            content: prompt,

          },

        ],

        temperature: 0.5,

      });

    const content =

      response.choices?.[0]
      ?.message?.content

      || "[]";

    let parsed = [];

    try {

      parsed =
        JSON.parse(content);

    } catch {

      parsed = [

        {

          type: "System",

          title:
            "AI Response Failure",

          description:
            "The AI returned an invalid response format.",

        },

      ];
    }

    return new Response(

      JSON.stringify(parsed),

      {

        headers: {

          ...corsHeaders,

          "Content-Type":
            "application/json",

        },

      }
    );

  } catch (error) {

    console.error(error);

    const message =

      error instanceof Error

        ? error.message

        : "Unknown AI generation error";

    return new Response(

      JSON.stringify({

        error: message,

      }),

      {

        status: 500,

        headers: {

          ...corsHeaders,

          "Content-Type":
            "application/json",

        },

      }
    );
  }
});