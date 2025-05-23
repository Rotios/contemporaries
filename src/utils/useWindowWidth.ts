import { createSignal, onCleanup, onMount } from "solid-js";

export function useWindowWidth() {
  const [width, setWidth] = createSignal(0);

  onMount(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    onCleanup(() => window.removeEventListener("resize", handleResize));
  });

  return width;
}