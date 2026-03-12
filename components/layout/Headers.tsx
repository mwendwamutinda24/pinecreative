import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const Headers = () => {
  return (
    <div className="w-full bg-gray-50 shadow-sm border-t">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end space-x-4">
        <Button 
          asChild
          size="lg"
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <Link href="/login" className="flex items-center space-x-2">
            <span>Login</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button 
          asChild
          size="lg"
          className="bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          <Link href="/register" className="flex items-center space-x-2">
            <span>Sign up</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Headers;
