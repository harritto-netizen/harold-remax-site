import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * True only when the signed-in user carries the admin role in app_metadata.
 * app_metadata is server-controlled and cannot be edited by the user, unlike
 * user_metadata. The database policies key on the same claim.
 */
export const isAdmin = (user: User | null): boolean =>
  !!user && (user.app_metadata as Record<string, unknown> | undefined)?.role === 'admin';

export const getCurrentAdmin = async (): Promise<User | null> => {
  const user = await getCurrentUser();
  return isAdmin(user) ? user : null;
};
