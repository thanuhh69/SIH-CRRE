import { NextRequest, NextResponse } from 'next/server';
import { TeamRegistration } from '@/types';

// In-memory server-side database store for fallback
let serverRegistrationsDb: TeamRegistration[] = [
  {
    id: 'SIH-2026-1001',
    teamName: 'InnovateX CRR',
    leaderName: 'K. Sai Teja',
    leaderEmail: 'saiteja@sircrrcoestd.in',
    leaderPhone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    problemStatementId: 'SIH1284',
    problemStatementTitle: 'AI-Driven Smart Water Quality Monitoring',
    facultyMentor: 'Dr. V. S. N. Murthy (HOD CSE)',
    members: [
      { name: 'K. Sai Teja', email: 'saiteja@sircrrcoestd.in', phone: '9876543210', rollNumber: '21B91A0501', department: 'CSE', year: '4th Year', isLeader: true },
      { name: 'P. Anusha', email: 'anusha@sircrrcoestd.in', phone: '9876543211', rollNumber: '21B91A0502', department: 'CSE', year: '4th Year' },
    ],
    status: 'approved',
    submittedAt: '2026-08-10T10:30:00.000Z'
  }
];

export async function GET() {
  return NextResponse.json({ success: true, data: serverRegistrationsDb });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newReg: TeamRegistration = {
      ...body,
      id: `SIH-2026-${randomNum}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    serverRegistrationsDb = [newReg, ...serverRegistrationsDb];

    return NextResponse.json({
      success: true,
      message: 'Registration created successfully',
      data: newReg,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
