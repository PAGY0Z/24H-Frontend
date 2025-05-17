import { Suspense } from "react";
import ArtefactsClient from "./Artefacts_Show";

export default function ArtefactsPageWrapper() {
  return (
    <Suspense fallback={<div></div>}>
      <ArtefactsClient />
    </Suspense>
  );
}
