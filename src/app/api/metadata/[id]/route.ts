// src/app/api/metadata/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const mockTicket = {
    name: `CryptoLottery Ticket #${id}`,
    description: "A dynamic NFT ticket for the CryptoLottery draw.",
    image: "https://cryptolottery.today/images/common.png",
    attributes: [
      { trait_type: "Type", value: "Common" },
      { trait_type: "Status", value: "Unactivated" },
      { trait_type: "Purchase Price", value: "1 USDT (paid in $LOTTO)" }
    ]
  };

  return NextResponse.json(mockTicket);
}
