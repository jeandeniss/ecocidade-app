import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, points, description, co2_saved, waste_prevented } = body;

    const { data, error } = await supabase
      .from('eco_actions')
      .insert([
        {
          user_id: user.id,
          type,
          points,
          description,
          co2_saved,
          waste_prevented,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Update user points
    await supabase
      .from('users')
      .update({ points: points })
      .eq('id', user.id);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}