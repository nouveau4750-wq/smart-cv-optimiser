import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-CV] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    logStep("API key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { cvId, jobDescription } = await req.json();
    if (!cvId || !jobDescription) {
      throw new Error("CV ID and job description are required");
    }
    logStep("Request data received", { cvId, jobDescriptionLength: jobDescription.length });

    // Fetch CV data
    const { data: cvData, error: cvError } = await supabaseClient
      .from("cvs")
      .select("*")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();

    if (cvError || !cvData) {
      throw new Error("CV not found or access denied");
    }
    logStep("CV data fetched", { cvTitle: cvData.title });

    // Build CV text for analysis
    const personalInfo = cvData.personal_info as Record<string, string> || {};
    const experience = cvData.experience as Array<Record<string, string>> || [];
    const education = cvData.education as Array<Record<string, string>> || [];
    const skills = cvData.skills as Array<Record<string, string>> || [];
    const languages = cvData.languages as Array<Record<string, string>> || [];

    const cvText = `
CV Title: ${cvData.title}
Summary: ${cvData.summary || "N/A"}

Personal Information:
- Name: ${personalInfo.fullName || "N/A"}
- Email: ${personalInfo.email || "N/A"}
- Phone: ${personalInfo.phone || "N/A"}
- Location: ${personalInfo.location || "N/A"}

Experience:
${experience.map(exp => `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`).join("\n")}

Education:
${education.map(edu => `- ${edu.degree} at ${edu.school} (${edu.startDate} - ${edu.endDate})`).join("\n")}

Skills:
${skills.map(skill => `- ${skill.name} (${skill.level})`).join("\n")}

Languages:
${languages.map(lang => `- ${lang.name} (${lang.level})`).join("\n")}
    `.trim();

    logStep("CV text prepared", { textLength: cvText.length });

    const systemPrompt = `Tu es un expert en recrutement et analyse de CV. Tu dois analyser un CV par rapport à une offre d'emploi et fournir une évaluation détaillée.

Tu dois retourner ta réponse au format JSON avec la structure suivante:
{
  "compatibility_score": <number entre 0 et 100>,
  "keywords": {
    "matched": [<mots-clés du CV correspondant à l'offre>],
    "missing": [<mots-clés manquants dans le CV>]
  },
  "strengths": [<liste des points forts du candidat>],
  "improvements": [<liste des améliorations suggérées>],
  "recommendations": [<recommandations personnalisées>]
}

Sois précis, constructif et bienveillant dans ton analyse.`;

    const userPrompt = `Analyse ce CV par rapport à l'offre d'emploi suivante:

=== OFFRE D'EMPLOI ===
${jobDescription}

=== CV ===
${cvText}

Fournis ton analyse au format JSON.`;

    logStep("Calling Lovable AI");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    logStep("AI response received", { contentLength: content.length });

    // Parse JSON from response (handle markdown code blocks)
    let analysisResult;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      analysisResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    logStep("Analysis complete", { score: analysisResult.compatibility_score });

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
