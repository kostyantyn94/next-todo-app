# 📝 ToDo App with Next.js & Supabase

This is a **full-stack ToDo application** built with **Next.js**, **Supabase**, and **React Query**.  
It supports **authentication, real-time updates, optimistic UI, and drag & drop sorting**.

## 🚀 Features
- ✅ **User Authentication** (via Supabase)
- ✅ **Create, Edit, Delete, and Update ToDo items**
- ✅ **Optimistic UI Updates** for smooth experience
- ✅ **Drag & Drop Sorting** (with @hello-pangea/dnd)
- ✅ **Dark & Light Mode** (via `next-themes`)
- ✅ **Server & Client Components** integration
- ✅ **Next.js App Router API Routes**

---

## 📦 **Tech Stack**
- **Frontend:** Next.js (App Router) + React Query + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **State Management:** React Query (TanStack)
- **Drag & Drop:** @hello-pangea/dnd
- **Styling:** Tailwind CSS
- **Database ORM:** Supabase Client

---

## 🔧 **Installation & Setup**

1. Clone the repository
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/todo-app-nextjs.git
cd todo-app-nextjs
```

2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```

3. Set up environment variables:  
   Create a `.env.local` file and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```sh
   npm run dev  # or yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage
- **Sign up & Sign in** entering your email and password.
- **Create a ToDo** by entering a title and clicking "Add".
- **Edit a ToDo** by clicking the "Edit" button.
- **Mark as completed** by checking the checkbox.
- **Delete a ToDo** by clicking the "Delete" button.
- **Reorder tasks** using drag & drop.

## 🚀 Deployment
To deploy the app:
1. Connect the repository to **Vercel** (recommended) or **Netlify**.
2. Set the required environment variables in the deployment settings.
3. Deploy 🚀

## 📜 License
This project is licensed under the **MIT License**.

---

Made with ❤️ using Next.js & Supabase 🚀