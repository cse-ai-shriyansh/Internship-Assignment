// /functions/create-task/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Load secrets from environment
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Supabase client (SERVICE ROLE → bypass RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false }
});

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), {
        status: 405,
      });
    }

    const { application_id, task_type, due_at } = await req.json();

    // ------------------------------
    // VALIDATION
    // ------------------------------

    if (!application_id || !task_type || !due_at) {
      return new Response(JSON.stringify({
        error: "Missing fields: application_id, task_type, due_at"
      }), { status: 400 });
    }

    const allowed = ["call", "email", "review"];
    if (!allowed.includes(task_type)) {
      return new Response(JSON.stringify({ error: "Invalid task_type" }), {
        status: 400,
      });
    }

    const dueDate = new Date(due_at);
    const now = new Date();

    if (isNaN(dueDate.getTime()) || dueDate <= now) {
      return new Response(JSON.stringify({
        error: "due_at must be a valid future datetime"
      }), { status: 400 });
    }

    // ------------------------------
    // INSERT TASK
    // ------------------------------

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        related_id: application_id,
        type: task_type,
        due_at: dueDate.toISOString(),
        tenant_id: crypto.randomUUID()
      })
      .select("id")
      .single();

    if (error) {
      console.error("DB Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    const taskId = data.id;

    // ------------------------------
    // REALTIME BROADCAST
    // ------------------------------

    await supabase.realtime.channel("task.created").send({
      type: "broadcast",
      event: "task.created",
      payload: {
        task_id: taskId,
        application_id,
        task_type,
        due_at
      }
    });

    // ------------------------------
    // SUCCESS RESPONSE
    // ------------------------------

    return new Response(JSON.stringify({
      success: true,
      task_id: taskId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Internal error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});
