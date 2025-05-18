import { Suspense } from "react";
import ArtefactsClient from "./Podium";

export default function PodiumPageWrapper() {
  return (
    <Suspense fallback={<div></div>}>
      <ArtefactsClient />
    </Suspense>
  );
}
