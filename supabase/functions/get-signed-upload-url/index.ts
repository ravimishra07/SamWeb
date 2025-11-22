import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Create a Supabase client with the Auth context of the logged in user
        const supabaseClient = createClient(
            // Supabase API URL - env var automatically populated by Supabase
            Deno.env.get('SUPABASE_URL') ?? '',
            // Supabase Anon Key - env var automatically populated by Supabase
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            // Create client with Auth context of the user that called the function
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // Get the user from the authorization header
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const { filename, filetype } = await req.json()

        // Sanitize filename and create a unique path
        const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
        const timestamp = new Date().getTime()
        const path = `${user.id}/${timestamp}_${cleanFilename}`

        // Create a signed URL for uploading to the 'attachments' bucket
        // The bucket must be private for this to be secure
        const { data, error } = await supabaseClient
            .storage
            .from('attachments')
            .createSignedUploadUrl(path)

        if (error) {
            throw error
        }

        return new Response(
            JSON.stringify({
                signedUrl: data.signedUrl,
                path: data.path,
                token: data.token
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
