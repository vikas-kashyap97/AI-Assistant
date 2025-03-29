import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
    try {
        const { subId } = await req.json();

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_LIVE_KEY!,
            key_secret: process.env.RAZORPAY_SECRET_KEY!
        });

        const result = await instance.subscriptions.cancel(subId);

        return NextResponse.json(result, { status: 200 }); // Wrap result in a Response object
    } catch (error) {
        return NextResponse.json({ error: "Failed to cancel subscription", details: error }, { status: 500 });
    }
}
