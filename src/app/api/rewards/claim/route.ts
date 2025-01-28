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

    const { rewardId, pointsCost } = await request.json();

    // Start a transaction
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    if (userData.points < pointsCost) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      );
    }

    // Claim the reward
    const { data, error } = await supabase
      .from('claimed_rewards')
      .insert([
        {
          user_id: user.id,
          reward_id: rewardId,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Deduct points
    await supabase
      .from('users')
      .update({ points: userData.points - pointsCost })
      .eq('id', user.id);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}