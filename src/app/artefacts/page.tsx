import { Suspense } from "react";
import ArtefactsClient from "./ArtefactsClient";

export default function ArtefactsPageWrapper() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ArtefactsClient />
    </Suspense>
  );
}
