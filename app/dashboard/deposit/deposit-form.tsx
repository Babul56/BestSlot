'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';
import Bkash from '@/assets/bkash.webp';
import Nagad from '@/assets/nagad.webp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export function DepositForm() {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'deposit' | 'verify'>('deposit');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('verify');
    }, 2000);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Deposit verified! Transaction ID: ${transactionId}`);
      setStep('deposit');
      setAmount('');
      setPhoneNumber('');
      setTransactionId('');
    }, 1000);
  };

  const handleCopyWallet = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  const amountNum = Number.parseFloat(amount);
  const isAmountValid =
    !Number.isNaN(amountNum) && amountNum >= 200 && amountNum <= 20000;

  const walletAddress =
    selectedMethod === 'bkash' ? '017XXXXXXXX' : '018XXXXXXXX';

  if (step === 'verify') {
    return (
      <Card className='w-full max-w-lg border-border shadow-xl'>
        <CardHeader className='space-y-1'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20'>
            <CheckCircle2 className='h-8 w-8 ' />
          </div>
          <CardTitle className='text-center text-2xl font-bold text-foreground'>
            Verify Transaction
          </CardTitle>
          <CardDescription className='text-center text-muted-foreground'>
            Please complete the payment on your{' '}
            {selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} app and enter the
            transaction ID below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifySubmit} className='space-y-6'>
            <div className='rounded-lg bg-muted/50 p-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Amount</span>
                <span className='font-semibold text-foreground'>
                  {amount} BDT
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Method</span>
                <span className='font-semibold text-foreground capitalize'>
                  {selectedMethod}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Your Number</span>
                <span className='font-semibold text-foreground'>
                  {phoneNumber}
                </span>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                <Wallet className='h-4 w-4' />
                <span>Send Money To</span>
              </div>

              <div className='rounded-lg border-2 border-secondary/20 bg-secondary/5 p-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-xs text-muted-foreground'>
                      {selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} Wallet
                      Number
                    </p>
                    <p className='text-2xl font-bold text-foreground tracking-wider'>
                      {walletAddress}
                    </p>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => handleCopyWallet(walletAddress)}
                    className='h-9 gap-2'
                  >
                    <Copy className='h-4 w-4' />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <Alert className='border-amber-500/50 bg-amber-500/10'>
                <AlertCircle className='h-4 w-4 text-amber-600' />
                <AlertDescription className='text-sm text-foreground '>
                  <p>
                    <span>
                      <strong>Important: </strong>
                    </span>
                    We only accept{' '}
                    <strong className='text-primary'>Send Money</strong> to this
                    wallet. Please send the exact amount of{' '}
                    <strong className='text-primary'>{amount}</strong> BDT.
                    Otherwise, the deposit will not be credited.
                  </p>
                </AlertDescription>
              </Alert>
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='trxid'
                className='text-sm font-semibold text-foreground'
              >
                Transaction ID (TrxID)
              </Label>
              <Input
                id='trxid'
                type='text'
                placeholder='Enter transaction ID (e.g., 8N7A5B2C3D)'
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className='h-12 border-border bg-background text-foreground'
                required
              />
              <p className='text-xs text-muted-foreground'>
                You will receive the transaction ID from {selectedMethod} after
                completing the payment
              </p>
            </div>

            <div className='space-y-3'>
              <Button
                type='submit'
                disabled={isProcessing || !transactionId}
                className='h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90'
              >
                {isProcessing ? (
                  <span className='flex items-center gap-2'>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent' />
                    Verifying...
                  </span>
                ) : (
                  'Verify & Complete Deposit'
                )}
              </Button>

              <Button
                type='button'
                variant='ghost'
                onClick={() => setStep('deposit')}
                className='w-full text-muted-foreground hover:text-foreground'
                disabled={isProcessing}
              >
                Back to Deposit Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-lg border-border shadow-xl'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-foreground'>
          Make a Deposit
        </CardTitle>
        <CardDescription className='text-muted-foreground'>
          Select your payment method and enter the amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-3'>
            <Label className='text-sm font-semibold text-foreground'>
              Payment Method
            </Label>
            <RadioGroup
              value={selectedMethod}
              onValueChange={setSelectedMethod}
              className='grid gap-3'
            >
              <label
                htmlFor='bkash'
                className={cn(
                  'relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all',
                  selectedMethod === 'bkash'
                    ? 'border-secondary bg-secondary/5 shadow-sm'
                    : 'border-border bg-card hover:border-secondary/50',
                )}
              >
                <RadioGroupItem
                  value='bkash'
                  id='bkash'
                  className='text-secondary'
                />
                <div className='flex items-center gap-3'>
                  <Image
                    src={Bkash}
                    alt='Nagad'
                    className='h-12 w-12 object-cover'
                  />
                  <div className='flex-1'>
                    <div className='font-semibold text-foreground'>bKash</div>
                    <div className='text-xs text-muted-foreground'>
                      Mobile wallet payment
                    </div>
                  </div>
                </div>
                {selectedMethod === 'bkash' && (
                  <CheckCircle2 className='absolute right-4 h-5 w-5 text-secondary' />
                )}
              </label>

              <label
                htmlFor='nagad'
                className={cn(
                  'relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all',
                  selectedMethod === 'nagad'
                    ? 'border-secondary bg-secondary/5 shadow-sm'
                    : 'border-border bg-card hover:border-secondary/50',
                )}
              >
                <RadioGroupItem
                  value='nagad'
                  id='nagad'
                  className='text-secondary'
                />
                <div className='flex items-center gap-3'>
                  <Image
                    src={Nagad}
                    alt='Nagad'
                    className='h-12 w-12 object-cover'
                  />
                  <div className='flex-1'>
                    <div className='font-semibold text-foreground'>Nagad</div>
                    <div className='text-xs text-muted-foreground'>
                      Digital financial service
                    </div>
                  </div>
                </div>
                {selectedMethod === 'nagad' && (
                  <CheckCircle2 className='absolute right-4 h-5 w-5 text-secondary' />
                )}
              </label>
            </RadioGroup>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className='text-sm font-semibold text-foreground'
            >
              {selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} Number
            </Label>
            <Input
              id='phone'
              type='tel'
              placeholder='01XXXXXXXXX'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='h-12 border-border bg-background text-foreground'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='amount'
              className='text-sm font-semibold text-foreground'
            >
              Amount (BDT)
            </Label>
            <Input
              id='amount'
              type='number'
              placeholder='Enter amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='h-12 border-border bg-background text-foreground'
              min='200'
              max='20000'
              required
            />
            {amount && !isAmountValid && (
              <p className='text-xs text-destructive'>
                Amount must be between 200 and 20,000 BDT
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium text-muted-foreground'>
              Quick Select
            </Label>
            <div className='grid grid-cols-4 gap-2'>
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setAmount(quickAmount.toString())}
                  className={cn(
                    'h-10 border-border bg-card text-foreground hover:border-secondary hover:bg-secondary/10 hover:text-secondary',
                    amount === quickAmount.toString() &&
                      'border-secondary bg-secondary/10 text-secondary',
                  )}
                >
                  {quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type='submit'
            disabled={isProcessing || !amount || !phoneNumber || !isAmountValid}
            className='h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90'
          >
            {isProcessing ? (
              <span className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent' />
                Processing...
              </span>
            ) : (
              <span className='flex items-center gap-2'>
                Continue to Payment
                <ArrowRight className='h-4 w-4' />
              </span>
            )}
          </Button>

          <p className='text-center text-xs leading-relaxed text-muted-foreground'>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Deposit amount must be between 200 and 20,000 BDT.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
