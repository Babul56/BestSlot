// app/api/deposit/request/route.ts

import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const {
      amount,
      paymentMethod,
      paymentTransactionId,
      senderNumber,
      receiverNumber,
      proofImageUrl,
    } = body;

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isActive || user.banned) {
      return NextResponse.json(
        { error: 'Account is inactive or banned' },
        { status: 403 },
      );
    }

    // Check for duplicate transaction ID
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        type: 'DEPOSIT',
        metadata: {
          path: ['paymentTransactionId'],
          equals: paymentTransactionId,
        },
      },
    });

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'This transaction ID has already been submitted' },
        { status: 400 },
      );
    }

    // Check if user has too many pending requests
    const pendingCount = await prisma.transaction.count({
      where: {
        userId,
        type: 'DEPOSIT',
        status: 'PENDING',
      },
    });

    if (pendingCount >= 3) {
      return NextResponse.json(
        {
          error:
            'You have too many pending deposit requests. Please wait for approval.',
        },
        { status: 400 },
      );
    }

    // Create wallet if doesn't exist
    let wallet = user.wallet;
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          currency: 'BDT',
          lockedBalance: 0,
        },
      });
    }

    // Create transaction with PENDING status
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        type: 'DEPOSIT',
        status: 'PENDING',
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance, // Will be updated when approved
        currency: 'BDT',
        description: `Deposit request via ${paymentMethod}`,
        metadata: {
          paymentMethod,
          paymentTransactionId,
          senderNumber,
          receiverNumber,
          proofImageUrl,
          submittedAt: new Date().toISOString(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        title: 'Deposit Request Submitted',
        message: `Your deposit request of ${amount} BDT via ${paymentMethod} has been submitted and is pending approval.`,
        isRead: false,
        data: {
          transactionId: transaction.id,
          amount: amount,
        },
      },
    });

    // TODO: Send notification to admin (webhook, email, etc.)
    // await notifyAdminOfNewDeposit(transaction);

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit request submitted successfully',
        data: {
          id: transaction.id,
          amount: transaction.amount,
          paymentMethod,
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Deposit request error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create deposit request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// GET - Fetch user's deposit requests (pending transactions)
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // biome-ignore lint/suspicious/noExplicitAny: this is fine
    const where: any = {
      userId,
      type: 'DEPOSIT',
    };

    if (status) {
      where.status = status;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          description: true,
          metadata: true,
          balanceBefore: true,
          balanceAfter: true,
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch deposit requests error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch deposit requests',
      },
      { status: 500 },
    );
  }
}
