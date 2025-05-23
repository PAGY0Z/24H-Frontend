import { Suspense } from "react";
import ArtefactsClient from "./Artefacts_Show";

export default function ArtefactsShow_PageWrapper() {
  return (
    <Suspense fallback={<div></div>}>
      <ArtefactsClient />
    </Suspense>
  );
}
