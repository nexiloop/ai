# 📁 SQL Database Files

This folder contains all SQL database files for the Nexiloop AI Agent system.

## 🚀 Quick Start - Choose One

### ✅ **RECOMMENDED: Fixed Complete Setup**
```sql
-- Use this file for a fresh database setup
sql/FIXED_COMPLETE_DATABASE_SETUP.sql
```
**Features:**
- ✅ **No problematic extensions** (removes pg_crypto dependency)
- ✅ Uses `md5(random()::text)` instead of `gen_random_bytes()`
- ✅ Safe constraint creation with proper error handling
- ✅ All required columns included
- ✅ Works with all PostgreSQL/Supabase versions

### ⚡ **QUICK FIX: For Existing Databases**
```sql
-- Use this if you just need to add missing columns
sql/IMMEDIATE_FIX_NO_EXTENSIONS.sql
```
**Features:**
- ✅ Adds only missing columns to existing tables
- ✅ No extension dependencies
- ✅ Safe for production databases
- ✅ Includes the required "blog-draft" agent

## 📂 File Organization

### **Main Setup Files**
- `FIXED_COMPLETE_DATABASE_SETUP.sql` - **RECOMMENDED** complete setup without problematic extensions
- `COMPLETE_DATABASE_SETUP.sql` - Original file (has pg_crypto issue)
- `IMMEDIATE_FIX_NO_EXTENSIONS.sql` - Quick fix for missing columns

### **Migration Files**
- `add_agents_slug_column.sql` - Add slug column migration
- `IMMEDIATE_FIX.sql` - Original immediate fix
- `fix_agents_table_complete.sql` - Complete table fix

### **Schema Files**
- `COMPLETE_AGENTS_SCHEMA.sql` - Complete agents schema
- `AGENTS_SCHEMA.sql` - Basic agents schema
- `AGENTS_NEXILOOP_MIGRATION.sql` - Nexiloop migration

### **Feature-Specific Schemas**
- `CODEHAT_SCHEMA.sql` - CodeHat feature schema
- `IMAGE_GENERATION_SCHEMA.sql` - Image generation schema
- `BACKGROUND_REMOVAL_SCHEMA.sql` - Background removal schema
- `MOVIE_SEARCH_SCHEMA.sql` - Movie search schema
- `MOVIE_TMDB_SCHEMA.sql` - TMDB integration schema
- `FIX_USERS_TABLE.sql` - Users table fixes

## 🛠️ Issues Fixed

### ❌ **Previous Issues:**
- `ERROR: 0A000: extension "pg_crypto" is not available`
- `ERROR: 42601: syntax error at or near "NOT"` (constraint syntax)
- Missing `slug`, `example_inputs`, and other columns
- `Could not find the 'example_inputs' column of 'agents' in the schema cache`

### ✅ **Now Fixed:**
- **No extension dependencies** - uses standard PostgreSQL functions
- **Proper constraint syntax** - uses DO blocks for safe constraint creation
- **All required columns** - includes every column the application expects
- **Safe for all environments** - works with any PostgreSQL/Supabase version

## 🎯 How to Use

### For New Projects:
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy & paste `FIXED_COMPLETE_DATABASE_SETUP.sql`
3. Click **"Run"**
4. ✅ **Done!** Your database is ready

### For Existing Projects:
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy & paste `IMMEDIATE_FIX_NO_EXTENSIONS.sql`
3. Click **"Run"**
4. ✅ **Fixed!** Missing columns added safely

## 🔍 What's Included

### Tables Created:
- `users` - User accounts and profiles
- `agents` - AI agents with all required fields
- `chats` - Chat conversations
- `messages` - Individual chat messages

### Features:
- **Row Level Security (RLS)** policies
- **Indexes** for performance
- **Constraints** for data integrity
- **Triggers** for automatic timestamps
- **Functions** for slug generation
- **Curated agents** (General, Code Helper, Writing Assistant, Blog Draft Writer)

### Authentication Support:
- **Google OAuth** integration
- **GitHub OAuth** integration
- **Email/Password** authentication
- **Guest mode** support

## 🚨 Migration Notes

If you're migrating from the old setup:
1. **Backup your data first!**
2. Use `IMMEDIATE_FIX_NO_EXTENSIONS.sql` to add missing columns
3. Your existing data will be preserved
4. New constraints and indexes will be added safely

## 🐛 Troubleshooting

### Common Issues:

1. **"extension pg_crypto is not available"**
   - ✅ Use `FIXED_COMPLETE_DATABASE_SETUP.sql` instead
   - ✅ This removes the problematic extension

2. **"syntax error at or near NOT"**
   - ✅ Fixed with proper DO block syntax
   - ✅ Constraints are added safely

3. **"column does not exist"**
   - ✅ All required columns are now included
   - ✅ Use the immediate fix for existing databases

4. **"constraint already exists"**
   - ✅ All scripts use `IF NOT EXISTS` or proper error handling
   - ✅ Safe to run multiple times

---

**Choose the right file for your situation and your database will be ready! 🚀**
