import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  // 1. Validez les données (optionnel mais recommandé)
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Nom et email requis" },
      { status: 400 }
    );
  }

  // 2. Envoyez à Supabase
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contacts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) throw await response.json();

    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Échec de l'envoi à Supabase" },
      { status: 500 }
    );
  }
}