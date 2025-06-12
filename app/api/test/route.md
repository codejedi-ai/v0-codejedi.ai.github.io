import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'Hello from API',
      status: 200
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error ' + error },
      { status: 500 }
    );
  }
}
