// src/app/api/metadata/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const idNum = Number(id);

  // === ЛОГИРОВАНИЕ НАЧАЛО ===
  console.log("🔍 Запрошен ID:", idNum);
  console.log("📡 SUPABASE_URL (частично):", process.env.SUPABASE_URL?.slice(0, 30) + "...");
  console.log("🔑 SUPABASE_ANON_KEY (частично):", process.env.SUPABASE_ANON_KEY?.slice(0, 10) + "...");
  // === ЛОГИРОВАНИЕ КОНЕЦ ===

  if (isNaN(idNum) || idNum <= 0 || !Number.isInteger(idNum)) {
    return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 });
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('id, type, image, status')
    .eq('id', idNum)
    .single();

  // === ЛОГИРОВАНИЕ РЕЗУЛЬТАТА ===
  console.log("📥 Ответ из Supabase:", { ticket, error });

  if (error || !ticket) {
    // Возвращаем отладку вместо 404
    return NextResponse.json({
      error: 'Ticket not found',
      debug: {
        id: idNum,
        supabaseError: error,
        supabaseUrl: process.env.SUPABASE_URL ? '✅ defined' : '❌ undefined',
        supabaseKey: process.env.SUPABASE_ANON_KEY ? '✅ defined' : '❌ undefined',
      }
    }, { status: 404 });
  }

  const metadata = {
    name: `CryptoLottery Ticket #${ticket.id}`,
    description: 'A dynamic NFT ticket for the CryptoLottery draw.',
    image: ticket.image?.trim() || null,
    attributes: [
      { trait_type: 'Type', value: ticket.type },
      { trait_type: 'Status', value: ticket.status },
      { trait_type: 'Purchase Price', value: '1 USDT (paid in $LOTTO)' },
    ],
  };

  return NextResponse.json(metadata);
}