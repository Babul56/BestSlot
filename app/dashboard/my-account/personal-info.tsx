'use client';
import { zodResolver } from '@hookform/resolvers/zod'; // Import resolver
import { Camera, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod'; // Import Zod
import { UploadImage } from '@/cloudinary/upload-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser, useSession } from '@/lib/auth-client';
import { cn, getInitials } from '@/lib/utils';
import ActionItem from './action-items';

// 1. Define the Validation Schema
const profileSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters long' })
    .max(50, { message: 'Name is too long' })
    .regex(/^[a-zA-Z\s]*$/, {
      message: 'Name can only contain letters and spaces',
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PersonalInfo() {
  const { data: session, refetch } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const user = session?.user;

  // 2. Initialize Form with Zod Resolver
  const {
    register,
    handleSubmit,

    setValue,
    formState: { errors }, // Catch validation errors here
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  useEffect(() => {
    if (user?.name) setValue('name', user.name);
  }, [user?.name, setValue]);

  if (!user) return null;

  const onFormSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await updateUser({ name: values.name.trim() });
      await refetch();
      toast.success('Profile updated successfully');
      setIsOpen(false);
      router.refresh();
    } catch (_error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/'))
      return toast.error('Please upload an image file');
    if (file.size > 1 * 1024 * 1024)
      return toast.error('Image must be smaller than 1MB');

    setIsUploadingImage(true);
    try {
      const result = await UploadImage(file, 'user-avatars');
      await updateUser({ image: result.secure_url });
      await refetch();
      toast.success('Avatar updated');
      router.refresh();
    } catch (_error) {
      toast.error('Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='cursor-pointer'>
          <ActionItem
            icon={<User className='text-white size-5' />}
            iconBg='bg-yellow-400'
            title='Personal Information'
            description='Complete your profile to improve security.'
          />
        </div>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your public name and profile picture.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-6 py-4'>
            {/* Avatar Upload */}
            <div className='relative mx-auto group'>
              <Avatar className='w-28 h-28 ring-4 ring-background shadow-xl border'>
                <AvatarImage src={user.image || ''} className='object-cover' />
                <AvatarFallback className='text-3xl font-bold bg-muted uppercase text-muted-foreground'>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100 disabled:bg-black/20'
              >
                {isUploadingImage ? (
                  <Loader2 className='size-6 text-white animate-spin' />
                ) : (
                  <Camera className='size-6 text-white' />
                )}
              </button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageUpload}
              />
            </div>

            {/* Inputs */}
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label
                  htmlFor='name'
                  className={cn(errors.name && 'text-destructive')}
                >
                  Full Name
                </Label>
                <Input
                  id='name'
                  {...register('name')}
                  placeholder='Enter your name'
                  className={cn(
                    errors.name &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                {/* 3. Display Validation Error Message */}
                {errors.name && (
                  <p className='text-[11px] font-medium text-destructive mt-0.5'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className='grid gap-2 opacity-70'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  disabled
                  value={user.email}
                  className='bg-muted'
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSaving}>
              {isSaving && <Loader2 className='mr-2 size-4 animate-spin' />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
