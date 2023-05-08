

import Link from 'next/link';

import { useRouter } from 'next/router';
interface HeaderProps {
    title: string;
    navigation: string[];
}

export default function Header() {
    const router = useRouter();
    return (
        <header className='bg-black'>
          
        </header>
    );
   
}
