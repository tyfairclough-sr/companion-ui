import { Suspense } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { WinstonScene } from "@/components/WinstonScene";

export default function Home() {
  return (
    <>
      <AppShell />
      <Suspense fallback={null}>
        <WinstonScene />
      </Suspense>
    </>
  );
}
