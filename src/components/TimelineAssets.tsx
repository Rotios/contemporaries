import { onMount } from "solid-js";

export default function TimelineAssets() {
  onMount(() => {
    console.log("TimelineAssets mounted");
    if (!document.getElementById("timelinejs-css")) {
      const link = document.createElement("link");
      link.id = "timelinejs-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("timelinejs-js")) {
      const script = document.createElement("script");
      script.id = "timelinejs-js";
      script.src = "https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js";
      document.body.appendChild(script);
    }
  });
  return null;
}