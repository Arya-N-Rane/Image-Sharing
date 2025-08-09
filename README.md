# PhotoShare - React + Supabase Image Sharing App

A simple, production-ready image sharing application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🖼️ Public image upload with drag & drop
- 📱 Responsive gallery view
- ☁️ Supabase Storage for file hosting
- 🗄️ PostgreSQL database for metadata
- 🔒 Row Level Security (RLS) for data protection
- ⚡ Real-time updates
- 🚀 Production-ready deployment

## Setup Instructions

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the migration file content from `supabase/migrations/create_images_table.sql`

### 3. Storage Setup

1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `images`
3. Make the bucket **public**
4. Set up the following policies for the `images` bucket:

**Insert Policy:**
```sql
CREATE POLICY "Public upload access" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'images');
```

**Select Policy:**
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'images');
```

### 4. Environment Variables

1. In your Supabase dashboard, go to Settings → API
2. Copy your project URL and anon key
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Local Development

```bash
npm install
npm run dev
```

### 6. Deployment

#### Deploy to Vercel:

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

#### Deploy to Netlify:

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Add the environment variables in Netlify dashboard

## Project Structure

```
src/
├── components/
│   ├── ImageUpload.tsx    # Upload component with drag & drop
│   └── ImageGallery.tsx   # Gallery display component
├── lib/
│   └── supabase.ts        # Supabase client configuration
└── App.tsx                # Main app component
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Storage)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Deployment:** Vercel/Netlify ready

## Security Features

- Row Level Security (RLS) enabled
- Public read/write policies for images
- File type validation
- Secure file uploads via Supabase Storage

## Troubleshooting

### Common Issues:

1. **Images not loading:** Check if the Storage bucket is public
2. **Upload failing:** Verify Storage policies are set correctly
3. **Database errors:** Ensure the images table is created with proper RLS policies

### Support

For issues with:
- Supabase setup: [Supabase Documentation](https://supabase.com/docs)
- React/Vite: [Vite Documentation](https://vitejs.dev/)
- Deployment: [Vercel Docs](https://vercel.com/docs) or [Netlify Docs](https://docs.netlify.com/)