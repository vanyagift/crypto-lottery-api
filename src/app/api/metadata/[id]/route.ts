// src/app/api/metadata/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Инициализация Supabase клиента
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Маппинг type → отображаемое имя (для attributes.value)
const TYPE_DISPLAY_NAMES: Record<string, string> = {
  legendary: 'Legendary',
  event: 'Event',
  common: 'Common',
  ref: 'Referral',
  gift: 'Gift',
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Проверка, что id — число
  const idNum = Number(id);
  if (isNaN(idNum) || idNum <= 0 || !Number.isInteger(idNum)) {
    return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 });
  }

  // Запрос к Supabase
  const { data: ticket, error } = await supabase
    .from('tickets') // Убедись, что название таблицы именно 'tickets'
    .select('id, type, image, status, weight, draw_id, owner, created_at')
    .eq('id', idNum)
    .single();

  if (error || !ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  // Формируем attributes
  const attributes = [
    { trait_type: 'Type', value: TYPE_DISPLAY_NAMES[ticket.type] || ticket.type },
    { trait_type: 'Status', value: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) },
    { trait_type: 'Purchase Price', value: '1 USDT (paid in $LOTTO)' },
    // Можно добавить другие атрибуты по желанию, например, вес или ID розыгрыша
    // { trait_type: 'Weight', value: ticket.weight.toString() },
    // { trait_type: 'Draw ID', value: ticket.draw_id.toString() },
  ];

  // Формируем метаданные
  const metadata = {
    name: `CryptoLottery Ticket #${ticket.id}`,
    description: 'A dynamic NFT ticket for the CryptoLottery draw.',
    image: ticket.image, // Берём URL изображения напрямую из Supabase
    attributes,
  };

  return NextResponse.json(metadata);
}