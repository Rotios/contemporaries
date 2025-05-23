import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import TimelineAssets from "./components/TimelineAssets";
import ClientOnly from "./components/ClientOnly";
import { useWindowWidth } from "./utils/useWindowWidth";

<ClientOnly>
  <TimelineAssets />
</ClientOnly>
export default function App() {
  const width = useWindowWidth();

  return (
    <Router
      base={import.meta.env.SERVER_BASE_URL}
      root={props => (
        <main>
          <nav class="main-nav">
            <a href="#timeline">Home</a>
            {width() > 600 && (
              <>
                <a href="#about">About</a>
                <a href="#future-work">Future Work</a>
                <a href="#acknowledgements">Acknowledgments</a>
              </>
            )}
            <a href="https://www.rotios.dev/projects" target="_blank" rel="noopener noreferrer">More Projects &#8599;</a>
          </nav>
          <Suspense>{props.children}</Suspense>
        </main>
      )}
    >
      <FileRoutes />
    </Router>
  );
}