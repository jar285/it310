import { prisma } from '../prisma';
import { User, Profile, Prisma } from '@prisma/client';

export type UserWithProfile = User & {
  profile: Profile | null;
};

export const userRepository = {
  findById: async (id: string): Promise<UserWithProfile | null> => {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });
  },

  findByEmail: async (email: string): Promise<UserWithProfile | null> => {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
  },

  create: async (data: {
    name?: string;
    email: string;
    password?: string;
    image?: string;
  }): Promise<User> => {
    return prisma.user.create({
      data
    });
  },

  update: async (id: string, data: {
    name?: string;
    email?: string;
    image?: string;
  }): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data
    });
  },

  createProfile: async (userId: string, data: {
    bio?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }): Promise<Profile> => {
    return prisma.profile.create({
      data: {
        ...data,
        userId
      }
    });
  },

  updateProfile: async (userId: string, data: {
    bio?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }): Promise<Profile> => {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId
      }
    });
  },

  delete: async (id: string): Promise<User> => {
    return prisma.user.delete({
      where: { id }
    });
  }
};
