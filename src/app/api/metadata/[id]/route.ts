import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return NextResponse.json({
    name: `CryptoLottery Ticket #${id}`,
    description: "Dynamic NFT for CryptoLottery.today",
    image: "https://cryptolottery.today/images/common.png",
    attributes: [
      { trait_type: "Type", value: "Common" },
      { trait_type: "Status", value: "Unactivated" }
    ]
  });
}