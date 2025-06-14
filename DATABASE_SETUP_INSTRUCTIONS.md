# 🚀 Complete Database Setup - One-Time Run

## 🎯 Quick Fix Instructions

### Option 1: Complete Fresh Setup (Recommended)
1. **Open Supabase Dashboard** → SQL Editor
2. **Copy and paste** the entire contents of `COMPLETE_DATABASE_SETUP.sql`
3. **Click "Run"** - This will set up everything in one go!

### Option 2: Quick Migration Only
If you already have some data and just need to fix the missing columns:
1. **Open Supabase Dashboard** → SQL Editor
2. **Copy and paste** the contents of `add_agents_slug_column.sql`
3. **Click "Run"**

## 🔧 What This Fixes

### Database Issues Fixed:
- ✅ **Missing `slug` column** in agents table
- ✅ **Missing `example_inputs` column** in agents table  
- ✅ **Missing `remixable` column** in agents table
- ✅ **Missing `tools_enabled` column** in agents table
- ✅ **Missing `category` column** in agents table
- ✅ **Missing `max_steps` column** in agents table
- ✅ **Missing `mcp_config` column** in agents table
- ✅ **Missing `tags` column** in agents table
- ✅ **Missing `model_preference` column** in agents table

### Application Errors Fixed:
- ✅ `42703: column agents.slug does not exist`
- ✅ `Could not find the 'example_inputs' column of 'agents' in the schema cache`
- ✅ `23502: null value in column "slug" violates not-null constraint`
- ✅ `500 Internal Server Error` when creating agents

### Features Added:
- ✅ **Complete agent system** with all required fields
- ✅ **Curated agents** including "Blog Draft Writer" 
- ✅ **Proper indexes** for performance
- ✅ **Row Level Security** policies
- ✅ **Automatic slug generation** function
- ✅ **Auto-updating timestamps**

## 📋 Pre-configured Agents

The setup includes these curated agents:
- **General Assistant** (`general-assistant`)
- **Code Helper** (`code-helper`) 
- **Writing Assistant** (`writing-assistant`)
- **Blog Draft Writer** (`blog-draft`) ← This fixes the missing "blog-draft" error

## 🔍 Verification Steps

After running the SQL:

1. **Check tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Verify agent columns:**
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'agents' AND table_schema = 'public';
   ```

3. **Test agent creation** in your app - the 500 errors should be gone!

## 🚨 Important Notes

- **Backup first** if you have important data
- The complete setup includes **Row Level Security** - make sure your app authentication works
- **Indexes are included** for better performance
- **Realtime is enabled** for live chat updates

## 🐛 Still Having Issues?

If you still see errors after running the SQL:
1. Check the Supabase logs for any migration errors
2. Verify your app's Supabase connection settings
3. Try refreshing your browser cache
4. Check that all environment variables are set correctly

---

**This should fix all the database-related errors in one go! 🎉**
