import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get start of current week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    // Get eco actions for the week
    const { data: actions, error: actionsError } = await supabase
      .from('eco_actions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startOfWeek.toISOString());

    if (actionsError) throw actionsError;

    // Calculate totals
    const summary = {
      weekStartDate: startOfWeek,
      totalPoints: actions.reduce((sum, action) => sum + action.points, 0),
      actionsCount: actions.length,
      environmentalImpact: {
        totalCo2Saved: actions.reduce((sum, action) => sum + action.co2_saved, 0),
        totalWastePrevented: actions.reduce((sum, action) => sum + action.waste_prevented, 0),
      },
      topActions: actions.sort((a, b) => b.points - a.points).slice(0, 5),
      earnedRewards: [],
    };

    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}