# QuarkLeads Profile Dashboard

A production-ready Next.js implementation of the QuarkLeads Profile Dashboard, built with TypeScript, Tailwind CSS, and modern React patterns.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** (for version control)

## 📦 Installation

1. **Clone or extract the project:**
   ```bash
   cd test-quarklead
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

   The app will automatically redirect you to `/login` since you're not authenticated.

5. **Login:**
   - Use any email and password to sign in (demo mode)
   - Example: `ravi@gmail.com` / `password123`

## 🏗️ Project Structure

```
test-quarklead/
├── app/                          # Next.js app router directory
│   ├── api/                      # API routes
│   │   ├── profile/              # Profile endpoints
│   │   │   ├── route.ts          # GET /api/profile
│   │   │   └── update/route.ts   # POST /api/profile/update
│   │   └── activity/route.ts     # GET /api/activity
│   ├── profile/                  # Profile dashboard page
│   ├── affiliate-url/            # Affiliate URL page
│   ├── account-details/          # Account details page
│   ├── earnings/                 # Earnings page
│   ├── offers/                   # Offers page
│   ├── login/                    # Login page
│   ├── logout/                   # Logout page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects to /profile)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── Header.tsx                # Application header
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── ProfileCard.tsx           # Profile display card
│   ├── EditProfileModal.tsx      # Edit profile modal
│   ├── ProtectedRoute.tsx        # Auth wrapper component
│   └── __tests__/                # Component tests
├── lib/                          # Utilities and contexts
│   └── auth-context.tsx          # Authentication context
├── public/                       # Static assets (if any)
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 📝 Available Scripts

- **`npm run dev`** - Start development server on [http://localhost:3000](http://localhost:3000)
- **`npm run build`** - Build production-ready application
- **`npm start`** - Start production server (run `npm run build` first)
- **`npm run lint`** - Run ESLint to check for code issues
- **`npm test`** - Run Jest test suite
- **`npm run test:watch`** - Run tests in watch mode

## 🎨 Design Notes

### Color Palette
Based on the Figma screenshot, the following colors were extracted and implemented:

- **Primary Red**: `#DC2626` - Used for primary actions, active menu items, and logo
- **Secondary Pink**: `#EC4899` - Used for "Update Profile" button and accent elements
- **Sidebar Beige**: `#F5F5DC` - Light beige background for the sidebar
- **Accent Blue**: `#3B82F6` - Used for verification checkmarks

### Typography
- Font Family: Inter (loaded from Google Fonts)
- Headings: Bold weights (600-700)
- Body: Regular weight (400)

### Layout Assumptions
- Sidebar width: 256px (16rem) when expanded, 64px (4rem) when collapsed
- Header height: ~64px with sticky positioning
- Main content padding: 24px (1.5rem) on desktop, 16px (1rem) on mobile
- Border radius: 8px (0.5rem) for cards and buttons

### Responsive Breakpoints
- **Mobile**: ≤640px (sm)
- **Tablet**: 641px - 1024px (md, lg)
- **Desktop**: ≥1025px (xl, 2xl)

## 🔐 Authentication

### Current Implementation (Stub)

The application uses a client-side authentication stub stored in `localStorage`. This is suitable for demo purposes but should be replaced with a real authentication provider for production.

**How it works:**
- Login credentials are validated on the client side (any email/password works)
- Authentication state is stored in `localStorage`
- Protected routes check authentication status and redirect to `/login` if not authenticated

### Replacing with NextAuth.js

To integrate NextAuth.js (recommended):

1. **Install NextAuth:**
   ```bash
   npm install next-auth
   ```

2. **Create API route:** `app/api/auth/[...nextauth]/route.ts`
   ```typescript
   import NextAuth from 'next-auth'
   import CredentialsProvider from 'next-auth/providers/credentials'

   export const authOptions = {
     providers: [
       CredentialsProvider({
         name: 'Credentials',
         credentials: {
           email: { label: "Email", type: "email" },
           password: { label: "Password", type: "password" }
         },
         async authorize(credentials) {
           // Replace with your actual authentication logic
           if (credentials?.email && credentials?.password) {
             return { id: '1', email: credentials.email, name: 'User' }
           }
           return null
         }
       })
     ],
     pages: {
       signIn: '/login',
     },
   }

   export default NextAuth(authOptions)
   ```

3. **Update `lib/auth-context.tsx`** to use NextAuth's `useSession` hook instead of the stub

4. **Wrap your app** in `SessionProvider` from `next-auth/react`

5. **Update `ProtectedRoute.tsx`** to use `useSession` for authentication checks

### Alternative: Auth0

1. **Install Auth0:**
   ```bash
   npm install @auth0/nextjs-auth0
   ```

2. **Follow Auth0's Next.js integration guide:**
   [Auth0 Next.js Documentation](https://auth0.com/docs/quickstart/webapp/nextjs)

## 🔌 API Endpoints

All API routes are located in `app/api/`.

### GET `/api/profile`

Returns the current user's profile information.

**Response:**
```json
{
  "name": "Ravi Gupta",
  "email": "ravi@gmail.com",
  "mobile": "+91 8523697410",
  "address": "Noida, UP",
  "dateOfBirth": "January 1, 1990",
  "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi",
  "verified": true
}
```

### POST `/api/profile/update`

Updates the user's profile information.

**Request Body:**
```json
{
  "name": "Ravi Gupta",
  "email": "ravi@gmail.com",
  "mobile": "+91 8523697410",
  "address": "Noida, UP",
  "dateOfBirth": "January 1, 1990",
  "avatarUrl": "https://example.com/avatar.jpg",
  "verified": true
}
```

**Response:**
Returns the updated profile object with an additional `updatedAt` timestamp.

### GET `/api/activity`

Returns recent user activity.

**Response:**
```json
[
  {
    "id": "1",
    "type": "profile_update",
    "message": "Profile updated successfully",
    "timestamp": "2024-01-01T10:00:00.000Z"
  },
  {
    "id": "2",
    "type": "earnings",
    "message": "New commission earned: $250.00",
    "timestamp": "2024-01-01T07:00:00.000Z"
  }
]
```

## 🚢 Deployment to Vercel

### Method A: Connect Git Provider (Recommended)

This method automatically deploys on every push to your repository.

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub/GitLab:**
   - Create a new repository on GitHub or GitLab
   - Add the remote and push:
     ```bash
     git remote add origin https://github.com/yourusername/quarklead-dashboard.git
     git branch -M main
     git push -u origin main
     ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **"New Project"**
   - Click **"Import Git Repository"**
   - Select your repository
   - Vercel will auto-detect Next.js - confirm settings:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./` (default)
     - **Build Command**: `npm run build` (default)
     - **Output Directory**: `.next` (default)
     - **Install Command**: `npm install` (default)

4. **Configure Environment Variables (if needed):**
   - In the project settings, go to **"Environment Variables"**
   - Add any required variables (currently none needed for this project)
   - Example variables you might need later:
     - `NEXT_PUBLIC_API_BASE=https://api.example.com`
     - `NEXTAUTH_SECRET=your-secret-key`
     - `NEXTAUTH_URL=https://your-domain.vercel.app`

5. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (typically 1-2 minutes)
   - Your app will be live at `https://your-project.vercel.app`

6. **Verify deployment:**
   - Visit the provided URL
   - Test login flow
   - Verify all routes work correctly

### Method B: Vercel CLI (Alternate)

Deploy directly from your terminal without connecting a Git repository.

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate via browser or email.

3. **Deploy from project root:**
   ```bash
   cd test-quarklead
   vercel
   ```

   **Expected prompts and responses:**
   ```
   ? Set up and develop "~/test-quarklead"? [Y/n] y
   ? Which scope do you want to deploy to? [Your Name] (press Enter)
   ? Link to existing project? [y/N] n
   ? What's your project's name? quarklead-profile-dashboard (or press Enter for default)
   ? In which directory is your code located? ./ (press Enter)
   ```

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

   This creates a production URL (e.g., `https://quarklead-profile-dashboard.vercel.app`)

5. **Verify deployment:**
   - Visit the production URL
   - Test all functionality

### Troubleshooting Deployment

**Build fails:**
- Ensure all dependencies are listed in `package.json`
- Check that `next.config.js` is properly configured
- Review build logs in Vercel dashboard

**Environment variables missing:**
- Add them in Vercel project settings → Environment Variables
- Redeploy after adding variables

**Routes not working:**
- Verify Next.js version is 13+ (app router)
- Check that all routes are in `app/` directory
- Ensure API routes are in `app/api/`

## 🧪 Testing

Run tests with:
```bash
npm test
```

Test files are located in `components/__tests__/`. Currently, tests are written for:
- `Header` component
- `Sidebar` component

To add more tests:
1. Create test files matching the pattern `*.test.tsx`
2. Use React Testing Library and Jest
3. Follow existing test patterns

## 🛠️ Development Notes

### Key Features Implemented

- ✅ Pixel-perfect UI matching Figma screenshot
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Client-side authentication stub
- ✅ Protected routes with redirect
- ✅ API routes for profile and activity data
- ✅ Edit profile modal with form validation
- ✅ Logout functionality (button in header and `/logout` route)
- ✅ Accessible components (ARIA labels, keyboard navigation)
- ✅ TypeScript for type safety
- ✅ Component tests
- ✅ Sidebar collapse/expand functionality

### Future Enhancements

- Replace auth stub with NextAuth.js or Auth0
- Connect to real backend API
- Add more comprehensive error handling
- Implement real-time updates (WebSockets)
- Add data visualization for earnings
- Enhance accessibility (WCAG 2.1 AA compliance)

## 📄 License

This project is created for demonstration purposes.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
3. Review Tailwind CSS documentation: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

