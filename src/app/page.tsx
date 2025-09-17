import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Markachew Sales
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Next.js + Tailwind CSS + shadcn/ui Setup Complete
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Project</CardTitle>
              <CardDescription>
                Your Next.js project is now set up with Tailwind CSS and shadcn/ui components.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Enter your name" />
              </div>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Included</CardTitle>
              <CardDescription>
                Here's what's been set up for you:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Next.js 15 with App Router
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  TypeScript configuration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Tailwind CSS v4
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  shadcn/ui components
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ESLint configuration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Lucide React icons
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ready to start building? Run the development server:
          </p>
          <code className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg text-sm">
            npm run dev
          </code>
        </div>
      </div>
    </div>
  );
}
