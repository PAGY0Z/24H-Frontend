import { Suspense } from "react";
import ArtefactsClient from "./Artefacts_Add";

export default function ArtefactsAdd_PageWrapper() {
  return (
    <Suspense fallback={<div></div>}>
      <ArtefactsClient />
    </Suspense>
  );
}
