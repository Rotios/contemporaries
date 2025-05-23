import { createSignal, onMount, JSX } from "solid-js";

export default function ClientOnly(props: { children: JSX.Element }) {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));
  return mounted() ? props.children : null;
}