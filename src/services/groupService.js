/**
 * خدمة إدارة المجموعات السحابية (Group Service)
 * تتولى ربط المجموعات الدراسية بجدول groups في Supabase سحابياً بنسبة 100%
 * مع دعم البث اللحظي والتوافق السلس
 */

import { isSupabaseConfigured } from '../utils/supabaseConfig';

let _supabaseCache = null;
async function getSupabaseClient() {
  if (_supabaseCache) return _supabaseCache;
  const { supabase } = await import('../utils/supabaseClient');
  _supabaseCache = supabase;
  return _supabaseCache;
}

// تحويل كائن المجموعة من صيغة قاعدة البيانات (snake_case) إلى صيغة التطبيق (camelCase)
export function mapDbGroupToApp(dbRecord) {
  if (!dbRecord) return null;
  return {
    id: String(dbRecord.id),
    name: dbRecord.name || 'مجموعة دراسية',
    schedule: dbRecord.schedule || '',
    location: dbRecord.location || '',
    color: dbRecord.color || '#6366f1',
    studentIds: [], // يتم حسابه ديناميكياً من جدول الطلاب
    unlockedChunks: Array.isArray(dbRecord.unlocked_chunks) ? dbRecord.unlocked_chunks : ["ch1-l1-c1"],
    homeworkChunks: Array.isArray(dbRecord.homework_chunks) ? dbRecord.homework_chunks : [],
    homeworkNote: dbRecord.homework_note || '',
    createdAt: dbRecord.created_at || new Date().toISOString()
  };
}

// تحويل كائن المجموعة من صيغة التطبيق إلى صيغة قاعدة البيانات
export function mapAppGroupToDb(appGroup) {
  if (!appGroup) return null;
  return {
    id: String(appGroup.id),
    name: String(appGroup.name).trim(),
    schedule: appGroup.schedule || '',
    location: appGroup.location || '',
    color: appGroup.color || '#6366f1',
    unlocked_chunks: Array.isArray(appGroup.unlockedChunks) ? appGroup.unlockedChunks : [],
    homework_chunks: Array.isArray(appGroup.homeworkChunks) ? appGroup.homeworkChunks : [],
    homework_note: appGroup.homeworkNote || '',
    updated_at: new Date().toISOString()
  };
}

/**
 * 1. جلب كافة المجموعات الدراسية من Supabase
 */
export async function fetchGroupsFromSupabase() {
  if (!isSupabaseConfigured) return null;

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      // إذا كان الجدول غير منشأ بعد في سوبابيز، لا نعطل التطبيق
      console.warn('⚠️ Supabase groups fetch note:', error.message);
      return null;
    }

    if (data && Array.isArray(data)) {
      return data.map(mapDbGroupToApp);
    }
  } catch (err) {
    console.warn('⚠️ fetchGroupsFromSupabase error:', err);
  }

  return null;
}

/**
 * 2. حفظ أو تحديث مجموعة في جدول groups في Supabase
 */
export async function syncGroupWithSupabase(group) {
  if (!isSupabaseConfigured || !group) return group;

  try {
    const supabase = await getSupabaseClient();
    const dbPayload = mapAppGroupToDb(group);

    const { data, error } = await supabase
      .from('groups')
      .upsert(dbPayload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('⚠️ syncGroupWithSupabase note:', error.message);
      return group;
    }

    if (data) {
      return mapDbGroupToApp(data);
    }
  } catch (err) {
    console.warn('⚠️ syncGroupWithSupabase error:', err);
  }

  return group;
}

/**
 * 3. حذف مجموعة نهائياً من Supabase وإعادة الطلاب المسكنين فيها للعام
 */
export async function deleteGroupFromSupabase(groupId) {
  if (!isSupabaseConfigured || !groupId) return false;

  try {
    const supabase = await getSupabaseClient();

    // 1. إعادة الطلاب المسكنين في هذه المجموعة إلى حالة "العام / في انتظار التسكين"
    await supabase
      .from('students')
      .update({
        group_id: null,
        status: 'pending',
        current_station: 'في انتظار تحديد المجموعة من قِبل المعلم',
        updated_at: new Date().toISOString()
      })
      .eq('group_id', groupId);

    // 2. حذف المجموعة نفسها من جدول groups
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (error) {
      console.warn('⚠️ deleteGroupFromSupabase note:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('⚠️ deleteGroupFromSupabase error:', err);
    return false;
  }
}

/**
 * 4. تسكين طالب في مجموعة أو نقله إلى العام
 */
export async function assignStudentToGroupInSupabase(studentId, groupId, groupName = '') {
  if (!isSupabaseConfigured || !studentId) return false;

  try {
    const supabase = await getSupabaseClient();
    const updates = {
      group_id: groupId || null,
      status: groupId ? 'approved' : 'pending',
      current_station: groupId 
        ? `طالب معتمد في ${groupName || 'المجموعة الدراسية'}` 
        : 'في انتظار تحديد المجموعة من قِبل المعلم',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', studentId);

    if (error) {
      console.warn('⚠️ assignStudentToGroupInSupabase note:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('⚠️ assignStudentToGroupInSupabase error:', err);
    return false;
  }
}
