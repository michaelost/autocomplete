'use client'
import Image from "next/image";
import styles from "./page.module.css";

import { AppProps } from 'next/app';
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apolloClient";
import "./globals.css";
import Autocomplete from "./components/Autocomplete";

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <Autocomplete />
    </ApolloProvider>
  );
}