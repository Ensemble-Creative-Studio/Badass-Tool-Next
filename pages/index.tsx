import { groq } from "next-sanity";
import { client } from "../lib/sanity.client";
import { ReactNode, useState } from "react";
import Link from 'next/link';
import { useEffect } from "react";
import Head from "next/head";
import Header from "../components/header";
interface PageProps {
  metatitle: ReactNode;
  metadescription: string | undefined;
  title: string;
  videoBackground: string;
  description: string;
}

// Modify the getServerSideProps function to include a 'directors' property in the returned 'props' object
export async function getServerSideProps() {
  const query = groq`*[_type == 'directors'] | order(name asc)`; 
   const data = await client.fetch(query);
  if (data && data.length > 0) {
    return {
      props: {
        page: data[0],
        directors: data,
      },
    };
  }
  return { props: { page: null, directors: [] } };
}

// In the HomePage component, display the name of each director or a message if no directors are found
export default function HomePage({ page, directors }: { page: PageProps, directors: any[] }) {

  return (
    <div className="">
     <Header isHomepage={true} />
      <ul className="sm:text-big text-big-mobile founder-semiBold uppercase sm:pl-24 pl-12 leading-none sm:pt-16 pt-8">
        {directors.map((director) => (
          <li className="sm:pb-10 pb-4" key={director._id}>
            <Link href={`/director/${director.slug.current}`}>
              <p>{director.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
